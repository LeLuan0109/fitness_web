package com.example.Fitness.DTO.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * Chi tiết 1 ngày trong lịch tiến độ: buổi tập (nếu có) + các món đã ăn.
 * Dùng cho tooltip/panel khi người dùng click vào 1 ô ngày trên biểu đồ lịch.
 */
@Data
@Builder
public class ProgressDayDetailResponse {
    private LocalDate date;
    private String status;          // COMPLETED | PARTIAL | MISSED | PLANNED | REST | NONE
    private String planDayLabel;    // "Buổi 3" hoặc null

    private List<ExerciseItem> exercises;
    private List<MealItem> meals;

    private Double caloriesEaten;
    private Double caloriesTarget;
    private Double weight;

    @Data
    @Builder
    public static class ExerciseItem {
        private Long exerciseId;
        private String exerciseName;
        private int setsPlanned;
        private int setsLogged;
        private boolean done;
    }

    @Data
    @Builder
    public static class MealItem {
        private String name;
        private Double calories;
        private String mealType;
    }
}
