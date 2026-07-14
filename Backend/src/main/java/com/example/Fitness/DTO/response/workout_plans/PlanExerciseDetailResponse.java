package com.example.Fitness.DTO.response.workout_plans;

import com.example.Fitness.DTO.response.workout_logs.WorkoutLogResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PlanExerciseDetailResponse {
    private Long exerciseId;
    private String exerciseName;
    private String thumbnail;

    private Integer sets;
    private Integer reps;
    private Double weight;
    private Integer duration;

    private List<WorkoutLogResponse> logs;
}
