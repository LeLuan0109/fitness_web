package com.example.Fitness.DTO.response.Nutrition;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Nhật ký ăn của một ngày: danh sách món + tổng macro + mục tiêu calo/macro.
 */
@Data
@Builder
public class FoodDiaryResponse {
    private String date;
    private List<FoodLogItem> items;

    // Tổng đã ăn trong ngày
    private double totalCalories;
    private double totalProtein;
    private double totalCarbs;
    private double totalFat;

    // Mục tiêu theo TDEE + goal của user
    private double targetCalories;
    private double targetProtein;
    private double targetCarbs;
    private double targetFat;

    @Data
    @Builder
    public static class FoodLogItem {
        private Long id;
        private Long dishId;
        private String dishName;
        private String image;
        private int quantity;
        private String mealType;
        private double calories;
        private double protein;
        private double carbs;
        private double fat;
    }
}
