package com.example.Fitness.DTO.response.workout_plans;

import com.example.Fitness.DTO.response.ExerciseResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class WorkoutDayExerciseResponse {
    // --- Phần cấu hình tập luyện (Lấy từ bảng workoutday_exercises) ---
    private Long id; // ID của record trong bảng trung gian
    private Integer sets;
    private Integer reps;
    private Double weight;
    private Integer duration;

    private ExerciseResponse exercise;
}
