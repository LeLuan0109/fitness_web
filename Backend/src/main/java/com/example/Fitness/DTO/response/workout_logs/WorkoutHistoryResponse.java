package com.example.Fitness.DTO.response.workout_logs;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class WorkoutHistoryResponse {
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate date;
    private int totalExercises;
    private float totalCalories;
    private List<ExerciseHistorySummary> exercises;
}
