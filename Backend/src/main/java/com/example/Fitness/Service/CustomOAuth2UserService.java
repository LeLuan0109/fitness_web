package com.example.Fitness.Service;

import com.example.Fitness.Constants.AuthProvider;
import com.example.Fitness.Model.User;
import com.example.Fitness.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. Tải thông tin user từ Google
        OAuth2User oauthUser = super.loadUser(userRequest);

        // 2. Lấy thông tin email và name
        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        // 3. Xử lý logic nghiệp vụ
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            // User đã tồn tại, kiểm tra xem có phải là GOOGLE user không
            user = userOptional.get();
            if (!user.getProvider().equals(AuthProvider.GOOGLE)) {
                // Nếu user tồn tại nhưng là LOCAL, ném lỗi (hoặc bạn có thể tự động "link" 2 tài khoản)
                throw new OAuth2AuthenticationException("Email đã được đăng ký bằng tài khoản LOCAL!");
            }
            // Nếu là GOOGLE user, cập nhật tên nếu cần
            user.setName(name);
        } else {
            // User chưa tồn tại, tạo user mới
            user = registerNewGoogleUser(oauthUser);
        }
        user.setAttributes(oauthUser.getAttributes());
        // Spring Security sẽ dùng chính object User của chúng ta (vì nó implement UserDetails)
        // thay vì dùng Oauth2User mặc định
        return oauthUser;
    }

    private User registerNewGoogleUser(OAuth2User oauthUser) {
        User user = new User();
        user.setProvider(AuthProvider.GOOGLE);

        user.setEmail(oauthUser.getAttribute("email"));
        user.setName(oauthUser.getAttribute("name"));

        // Vì username không được null và phải unique
        // Ta có thể dùng email, hoặc tạo 1 username ngẫu nhiên
        user.setUsername(oauthUser.getAttribute("email")); // Dùng email làm username

        // Password có thể null
        user.setPassword(null);

        return userRepository.save(user);
    }
}