package com.example.DoanBE.Repository;

import com.example.DoanBE.Model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    // Bạn có thể cần hàm này để xóa token cũ nếu user request nhiều lần
    void deleteByUser(com.example.DoanBE.Model.User user);
}