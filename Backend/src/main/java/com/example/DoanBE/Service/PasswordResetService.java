package com.example.DoanBE.Service;

import com.example.DoanBE.Constants.AuthProvider;
import com.example.DoanBE.Model.PasswordResetToken;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.PasswordResetTokenRepository;
import com.example.DoanBE.Repository.UserRepository;
import com.example.DoanBE.Utils.PasswordGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private PasswordGenerator passwordGenerator;

    /**
     * API 1: Xử lý yêu cầu quên mật khẩu
     */
    public void processForgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Không tìm thấy người dùng với email: " + email);
        }

        User user = userOptional.get();
        if (user.getProvider() != AuthProvider.LOCAL) {
            throw new RuntimeException("Tài khoản này được đăng ký qua Google, không thể reset mật khẩu.");
        }

        String newPassword = passwordGenerator.generateRandomPassword(10);

        // Gửi email
        // QUAN TRỌNG: Đây là link đến FRONTEND của bạn, không phải API backend
        String subject = "Yêu cầu đặt lại mật khẩu - DoanBE";
        String body = "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấp vào link dưới đây để tiếp tục:\n"
                + "\n\nNếu bạn không yêu cầu, vui lòng bỏ qua email này. Link sẽ hết hạn sau 60 phút.";

        emailService.sendEmail(user.getEmail(), subject, body);
    }

    /**
     * API 2: Xử lý đặt lại mật khẩu mới
     */
    public void resetPassword(String token, String newPassword) {
        // 1. Xác thực token
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ."));

        if (resetToken.isExpired()) {
            tokenRepository.delete(resetToken);
            throw new RuntimeException("Token đã hết hạn.");
        }

        // 2. Lấy user
        User user = resetToken.getUser();

        // 3. Đặt mật khẩu mới (đã băm)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 4. Xóa token sau khi hoàn tất
        tokenRepository.delete(resetToken);
    }
}