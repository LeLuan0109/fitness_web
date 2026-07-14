package com.example.Fitness.DTO.response.workout_plans;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class WorkoutDayDetailResponse {
    private Long dayId;
    private Integer weekNumber;
    private Integer dayOfWeek;
    private Integer dayInNumber;
    private List<WorkoutDayExerciseResponse> exercises;
}
