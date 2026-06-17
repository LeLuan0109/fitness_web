package com.example.DoanBE.Repository;

import com.example.DoanBE.Model.UserDeviceToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDeviceTokenRepository extends JpaRepository<UserDeviceToken, Long> {
    List<UserDeviceToken> findByUserId(Long userId);
    Optional<UserDeviceToken> findByToken(String token);
    @Modifying
    @Transactional
    @Query("DELETE FROM UserDeviceToken t WHERE t.token IN :tokens")
    void deleteByTokenIn(List<String> tokens);
}
