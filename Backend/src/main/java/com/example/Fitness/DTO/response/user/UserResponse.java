package com.example.Fitness.DTO.response.user;

import com.example.Fitness.DTO.response.role.RoleResponse;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String username;
    private String sex;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dateOfBirth;
    private String avatar;
    private Double height;
    private Double weight;
    @JsonProperty("isLocked")
    private boolean isLocked;
    private Integer currentStreak;
    private Integer longestStreak;
    private RoleResponse role;
}
