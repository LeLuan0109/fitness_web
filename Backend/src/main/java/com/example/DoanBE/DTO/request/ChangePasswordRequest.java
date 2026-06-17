package com.example.DoanBE.DTO.request;

import com.example.DoanBE.Constants.Constants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu cũ không được để trống!")
    private String oldPassword;

    @NotBlank(message = "Mật khẩu mới không được để trống!")
    @Pattern(regexp = Constants.PASSWORD_PATTERN)
    private String newPassword;

    @NotBlank(message = "Mật khẩu xác nhận không được để trống!")
    private String confirmNewPassword;
}