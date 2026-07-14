package com.example.Fitness.Config;

import com.example.Fitness.Model.User;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Utils.JwtTokenUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtTokenUtils jwtTokenUtils;
    private final UserRepository userRepository;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        Optional<User> userOptional = userRepository.findByUsername(email);

        User user = userOptional.orElseThrow(() -> new RuntimeException("Không tìm thấy user sau khi login OAuth2"));

        // 3. Tạo JWT
        String accessToken;
        String refreshToken;
        try {
            accessToken = jwtTokenUtils.generateToken(user);
            refreshToken = jwtTokenUtils.generateRefreshToken(user);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo token", e);
        }

        // 4. Xây dựng URL redirect về React
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshToken)
                .build().toUriString();

        // 5. Redirect
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
