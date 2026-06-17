package com.example.DoanBE.DTO.request;

import com.example.DoanBE.Enum.ActivityLevel;
import com.example.DoanBE.Enum.FitnessGoal;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String avatar;

    private String name;

    @NotNull(message = "Cân nặng không được để trống")
    @Min(value = 1, message = "Cân nặng không hợp lệ")
    private Double weight;

    @NotNull(message = "Chiều cao không được để trống")
    @Min(value = 1, message = "Chiều cao không hợp lệ")
    private Double height;

    @NotNull(message = "Mức độ vận động không được để trống")
    private ActivityLevel activityLevel;

    @NotNull(message = "Mục tiêu không được để trống")
    private FitnessGoal fitnessGoal;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải ở trong quá khứ")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dateOfBirth;
}
