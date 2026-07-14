package com.example.Fitness.DTO.request;

import lombok.*;
import org.jetbrains.annotations.NotNull;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class LoginRequest {
    @NonNull
    private String username;
    @NotNull
    private String password;
}
