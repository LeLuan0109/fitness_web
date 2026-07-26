package com.example.Fitness.DTO.response.Nutrition;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Chi tiết nhật ký ăn 1 ngày: thống kê macro/nước + timeline từng bữa (dự kiến vs thực tế).
 * status của từng bữa: MATCH (đúng thực đơn) | CHANGED (đổi món) | SKIPPED (bỏ bữa) | PLANNED (ngày tương lai)
 */
@Data
@Builder
public class FoodDiaryDayDetailResponse {
    private String date;
    private double completionPercent;
    private int mealsLogged;
    private int mealsPlanned;

    private double totalCalories;
    private double targetCalories;
    private double totalProtein;
    private double targetProtein;
    private double totalCarbs;
    private double targetCarbs;
    private double totalFat;
    private double targetFat;

    private Integer waterMl;
    private Integer waterTarget;
    private Double weekAdherencePercent;

    private List<MealSlot> slots;

    @Data
    @Builder
    public static class MealSlot {
        private String mealType;       // BREAKFAST | LUNCH | EXTRA_MEAL | DINNER
        private String mealTypeLabel;  // "Bữa sáng" ...
        private String time;           // "07:00"
        private String plannedDishName;
        private String actualItemName;
        private Double actualCalories;
        private Double actualProtein;
        private Double actualCarbs;
        private Double actualFat;
        private String status;
    }
}
