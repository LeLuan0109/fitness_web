package com.example.DoanBE.DTO.response.auth;

import com.example.DoanBE.Constants.AuthProvider;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterResponse {
    private Long id;

    private String name;

    private String email;

    private String username;

    private String avatar;

    private Double height;

    private Double weight;

    private AuthProvider provider;

    private boolean isLocked;

    private Integer currentStreak;

    private Integer longestStreak;
}
