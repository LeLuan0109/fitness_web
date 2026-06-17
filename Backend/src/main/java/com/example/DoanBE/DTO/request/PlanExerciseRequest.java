package com.example.DoanBE.DTO.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanExerciseRequest {
    @NotNull(message = "ID bài tập không được để trống")
    private Long exerciseId;

    private Integer sets;

    private Integer reps;

    private Integer duration;

    private Double weight;
}
