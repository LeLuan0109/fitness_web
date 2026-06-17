package com.example.DoanBE.DTO.response.workout_logs;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExerciseHistorySummary {
    private Long exerciseId;
    private String exerciseName;
    private String thumbnail;
    private int totalSets;
    private int totalReps;
    private int totalDurations;
    private float totalCalories;
}
