package com.example.Fitness.DTO.request;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LogWorkoutRequest {
    @NotNull(message = "ID bài tập không được để trống")
    private Long exerciseId;

    private Long workoutDayId;

    @NotNull(message = "Số set không được để trống")
    private Integer setNumber;

    @Nullable
    private Integer reps;

    @Nullable
    private Double weight;

    @Nullable
    private Float duration;

    /** Chất lượng nhận diện tư thế camera AI (VD "OK"/"UNCERTAIN_ORIENTATION"); null nếu ghi tay hoặc không xác định. */
    @Nullable
    private String poseQuality;
}
