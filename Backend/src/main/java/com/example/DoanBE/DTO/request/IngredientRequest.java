package com.example.DoanBE.DTO.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
public class IngredientRequest {
    @NotBlank(message = "Tên nguyên liệu không được để trống")
    private String name;

    @NotBlank(message = "Đơn vị tính không được để trống")
    private String standardUnit; // Lưu value của Enum (VD: "g", "ml")

    @NotNull(message = "Calo không được để trống")
    @Min(value = 0, message = "Calo phải lớn hơn hoặc bằng 0")
    private Float caloriesPerUnit;

    private MultipartFile image;
}
