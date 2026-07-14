package com.example.Fitness.DTO.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDayRequest {
    @NotNull(message = "Tuần thứ mấy không được để trống")
    private Integer weekNumber;

    @NotNull(message = "Thứ trong tuần không được để trống")
    private Integer dayOfWeek;

    @Valid
    private List<PlanExerciseRequest> exercises;
}
