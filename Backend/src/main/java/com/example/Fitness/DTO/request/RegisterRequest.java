package com.example.Fitness.DTO.request;

import com.example.Fitness.Constants.Constants;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, message = "Username phải có ít nhất 3 ký tự")
    private String username;

    @NotBlank(message = "Password không được để trống")
//    @Pattern(
//            regexp = Constants.PASSWORD_PATTERN,
//            message = "Password phải có ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt"
//    )
    private String password;

    @NotBlank(message = "ConfirmPassword không được để trống")
    private String confirmPassword;
}