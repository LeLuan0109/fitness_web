package com.example.Fitness.Controller;

import com.example.Fitness.Constants.AuthProvider;
import com.example.Fitness.DTO.request.*;
import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.DTO.response.auth.BasicInfoResponse;
import com.example.Fitness.DTO.response.auth.LoginResponse;
import com.example.Fitness.DTO.response.auth.RegisterResponse;
import com.example.Fitness.Model.User;
import com.example.Fitness.Service.*;
import com.example.Fitness.Utils.JwtTokenUtils;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/auth")
@Tag(name = "Auth controller")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final BlacklistedTokenService blacklistedTokenService;
    private final GoogleAuthService googleAuthService;
    private final FacebookAuthService facebookAuthService;
    private final JwtTokenUtils jwtTokenUtils;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            RegisterResponse registeredUser = authService.registerUser(registerRequest);

            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(registeredUser)
                    .build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                            .status(false)
                            .data(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authService.login(loginRequest);

            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .status(true)
                            .data(loginResponse)
                            .build()
            );

        } catch (BadCredentialsException | UsernameNotFoundException e) {
            // 3. Bắt lỗi xác thực (sai pass, không có user)
            return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                            .status(false)
                            .data(e.getMessage())
                            .build()
            );
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.builder()
                            .status(false)
                            .data(e.getMessage())
                            .build()
            );
        }
        catch (Exception e) {
            // 4. Bắt tất cả các lỗi khác (ví dụ: lỗi tạo token)
            return ResponseEntity.internalServerError().body(
                    ApiResponse.builder()
                            .status(false)
                            .data(e.getMessage())
                            .build()
            );
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody GoogleLoginRequest request) {
        try {
            GoogleIdToken.Payload payload = googleAuthService.verifyGoogleIdToken(request.getTokenId());
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String avatar = (String) payload.get("picture");
            User user = userService.findOrCreateUserByEmail(email, name, avatar, AuthProvider.GOOGLE);
            String accessToken;
            String refreshToken;
            try {
                accessToken = jwtTokenUtils.generateToken(user);
                refreshToken = jwtTokenUtils.generateRefreshToken(user);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi tạo token", e);
            }
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .status(true)
                            .data(
                                    LoginResponse.builder()
                                            .accessToken(accessToken)
                                            .refreshToken(refreshToken)
                                            .build()
                            )
                            .build()
            );
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.builder()
                    .status(false)
                    .data(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/facebook")
    public ResponseEntity<?> loginWithFacebook(@RequestBody FacebookLoginRequest request) {
        Map<String, Object> fbData = facebookAuthService.getUserInfo(request.getAccessToken());

        String email = (String) fbData.get("email");
        String name = (String) fbData.get("name");
        String providerId = (String) fbData.get("id"); // Facebook ID
        String avatar = ((Map<?, ?>)((Map<?, ?>)fbData.get("picture")).get("data")).get("url").toString();

        User user = userService.findOrCreateUserByEmail(email, name, avatar, AuthProvider.FACEBOOK);
        String accessToken;
        String refreshToken;
        try {
            accessToken = jwtTokenUtils.generateToken(user);
            refreshToken = jwtTokenUtils.generateRefreshToken(user);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo token", e);
        }
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .status(true)
                        .data(
                                LoginResponse.builder()
                                        .accessToken(accessToken)
                                        .refreshToken(refreshToken)
                                        .build()
                        )
                        .build()
        );
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {
        try {
            LoginResponse newTokens = authService.refreshToken(refreshTokenRequest.getRefreshToken());

            // Trả về token mới
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .status(true)
                            .data(newTokens)
                            .build());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody LogoutRequest logoutRequest) {
        try {
            blacklistedTokenService.create(logoutRequest);
            return ResponseEntity.ok(ApiResponse.builder().status(true).data("Đăng xuất thành công!").build());
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Đăng xuất thất bại");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        try {
            authService.processForgotPassword(forgotPasswordRequest.getEmail());
            return ResponseEntity.ok(ApiResponse.builder().status(true).data("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư (cả spam).").build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserProfile() {
        BasicInfoResponse info = authService.getBasicInfo();

        return ResponseEntity.ok(
                ApiResponse.<BasicInfoResponse>builder()
                        .status(true)
                        .data(info)
                        .build());
    }
}