package com.example.Fitness.Service;

import com.example.Fitness.DTO.request.LogoutRequest;
import com.example.Fitness.Model.BlacklistedToken;
import com.example.Fitness.Repository.BlacklistedTokenRepository;
import com.example.Fitness.Utils.JwtTokenUtils;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class BlacklistedTokenService {
    private final BlacklistedTokenRepository blacklistedTokenRepository;
    private final JwtTokenUtils jwtTokenUtils;

    public void create(LogoutRequest logoutRequest) {
        try {
            if(blacklistedTokenRepository.existsByToken(logoutRequest.getToken())) {
                throw new RuntimeException("Token đã tồn tại trong blacklist");
            }
            Claims claims = jwtTokenUtils.extractAllClaims(logoutRequest.getToken());
            Number userIdNumber = (Number) claims.get("userId");
            Long userId = userIdNumber.longValue();
            Date expiryDate = claims.getExpiration();
            BlacklistedToken blacklistedToken = BlacklistedToken.builder().token(logoutRequest.getToken())
                    .userId(userId)
                    .expiryDate(expiryDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()).build();
            blacklistedTokenRepository.save(blacklistedToken);
        }
        catch (Exception e) {
            throw new RuntimeException("Server Error!: "+ e.getMessage());
        }
    }

    public boolean isTokenExistsInBlacklist(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }
}
