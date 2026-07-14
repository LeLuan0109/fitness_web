package com.example.Fitness.DTO.response.auth;

import com.example.Fitness.DTO.response.role.RoleResponse;
import com.example.Fitness.Model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BasicInfoResponse {
    private Long id;
    private String username;
    private String email;
    private String name;
    private String avatar;
    private RoleResponse role;
    private boolean isOnboardingCompleted;
}
