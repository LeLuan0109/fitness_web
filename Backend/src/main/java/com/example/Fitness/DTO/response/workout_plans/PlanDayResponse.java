package com.example.Fitness.DTO.response.workout_plans;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PlanDayResponse {
    private Long id;
    private Integer dayOfWeek;
    private Integer dayInNumber;

    // Danh sách bài tập trong ngày
    private List<PlanExerciseDetailResponse> exercises;
}
