package com.example.Fitness.DTO.request;

import com.example.Fitness.Enum.ActivityLevel;
import com.example.Fitness.Enum.ExperienceLevel;
import com.example.Fitness.Enum.FitnessGoal;
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
@AllArgsConstructor
@NoArgsConstructor
public class OnboardingRequest {
    @NotNull(message = "Giới tính không được để trống")
    private String sex; // "MALE" hoặc "FEMALE"

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải ở trong quá khứ")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate dateOfBirth;

    @NotNull(message = "Cân nặng không được để trống")
    @Min(value = 1, message = "Cân nặng không hợp lệ")
    private Double weight;

    @NotNull(message = "Chiều cao không được để trống")
    @Min(value = 1, message = "Chiều cao không hợp lệ")
    private Double height;

    @NotNull(message = "Mục tiêu không được để trống")
    private FitnessGoal fitnessGoal;

    @NotNull(message = "Mức độ vận động không được để trống")
    private ActivityLevel activityLevel;

    // --- Các trường mở rộng (tùy chọn) phục vụ đề xuất chính xác hơn ---

    /** Kinh nghiệm tập: NEW | INTERMEDIATE | EXPERT. Nếu có → dùng thay PAL để suy độ khó. */
    private ExperienceLevel experienceLevel;

    /** Số buổi rảnh tập trong tuần (1-7) → khớp lịch kế hoạch. */
    @Min(value = 1, message = "Số buổi/tuần không hợp lệ")
    private Integer daysPerWeekAvailable;

    /** Cân nặng mục tiêu (kg) → tính lộ trình, cảnh báo ép cân. */
    @Min(value = 1, message = "Cân nặng mục tiêu không hợp lệ")
    private Double targetWeight;
}
