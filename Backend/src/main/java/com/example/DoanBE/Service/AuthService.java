package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.request.LoginRequest;
import com.example.DoanBE.DTO.request.RegisterRequest;
import com.example.DoanBE.DTO.response.auth.BasicInfoResponse;
import com.example.DoanBE.DTO.response.auth.LoginResponse;
import com.example.DoanBE.Constants.AuthProvider;
import com.example.DoanBE.DTO.response.auth.RegisterResponse;
import com.example.DoanBE.Mapper.RoleMapper;
import com.example.DoanBE.Mapper.UserMapper;
import com.example.DoanBE.Model.Role;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.RoleRepository;
import com.example.DoanBE.Repository.UserRepository;
import com.example.DoanBE.Utils.JwtTokenUtils;
import com.example.DoanBE.Utils.PasswordGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtils jwtTokenUtils;
    private final UserMapper userMapper;
    private final EmailService emailService;
    private final PasswordGenerator passwordGenerator;
    private final RoleMapper roleMapper;

    public RegisterResponse registerUser(RegisterRequest registerRequest) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username đã tồn tại!");
        }

        // Kiểm tra email đã tồn tại chưa
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        if(!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu và mật khẩu xác nhận không khớp!");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role mặc định (USER)"));

        // Tạo user mới
        User user = User.builder().email(registerRequest.getEmail()).username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .provider(AuthProvider.LOCAL)
                .role(userRole)
                .build();

        // Lưu user vào CSDL
        User savedUser = userRepository.save(user);
        RegisterResponse response = userMapper.userToRegisterResponse(savedUser);
        return response;
    }

    public BasicInfoResponse getBasicInfo() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Không tìm thấy người dùng với username: " + username
                ));
        return userMapper.userToBasicInfoResponse(user);
    }

    public LoginResponse login(LoginRequest loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            // Ném lỗi cụ thể nếu sai username/password
            throw new BadCredentialsException("Sai username hoặc password");
        }

        // 2. Nếu xác thực thành công, lấy thông tin User
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Không tìm thấy người dùng: " + loginRequest.getUsername()
                ));
        if(user.isLocked()) {
            throw new RuntimeException("Tài khoản của bạn đã bị khóa");
        }
        // 3. Tạo accessToken và refreshToken
        String accessToken = jwtTokenUtils.generateToken(user);
        String refreshToken = jwtTokenUtils.generateRefreshToken(user);

        // 4. Trả về response
        return new LoginResponse(accessToken, refreshToken);
    }

    public LoginResponse refreshToken(String refreshToken) throws Exception {
        String username = jwtTokenUtils.extractSubject(refreshToken);
        if(Objects.isNull(username)) {
            throw new RuntimeException("Không tìm thấy username từ token");
        }
        //Check token đã hết hạn chưa
        if(jwtTokenUtils.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token đã hết hạn");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Không tìm thấy người dùng với username: " + username
                ));
        UserDetails userDetails =
                org.springframework.security.core.userdetails.User.builder()
                        .username(user.getUsername()).password(user.getPassword())
                        .authorities(user.getAuthorities()).build();
        if (!jwtTokenUtils.validateToken(refreshToken, userDetails)) {
            throw new RuntimeException("Refresh token không hợp lệ");
        }
        String newAccessToken = jwtTokenUtils.generateToken(user);
        String newRefreshToken = jwtTokenUtils.generateRefreshToken(user);

        return new LoginResponse(newAccessToken, newRefreshToken);
    }

    public void processForgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy người dùng với email: " + email);
        }

        User user = userOptional.get();
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException("Tài khoản này không được đăng ký với tài khoản và mật khẩu, " +
                    "không thể reset mật khẩu.");
        }

        String newPassword = passwordGenerator.generateRandomPassword(10);
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        String subject = "Yêu cầu đặt lại mật khẩu của P-FIT";
        String body = "Bạn đã yêu cầu đặt lại mật khẩu. "+ "Mật khẩu mới của bạn là: " + newPassword + "\n\nVui lòng đăng nhập và đổi mật khẩu ngay lập tức."
                + "\n\nNếu bạn không thực hiện yêu cầu, vui lòng bỏ qua email này.";

        emailService.sendEmail(user.getEmail(), subject, body);
    }
}