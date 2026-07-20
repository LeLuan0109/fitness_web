package com.example.Fitness.DTO.response.Nutrition;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Tổng hợp nhật ký ăn theo khoảng thời gian (tuần/tháng): macro từng ngày + trung bình + mục tiêu.
 */
@Data
@Builder
public class FoodDiarySummaryResponse {
    private String fromDate;
    private String toDate;
    private List<DayMacro> days;

    // Trung bình mỗi ngày (chỉ tính trên các ngày có ăn)
    private double avgCalories;
    private double avgProtein;
    private double avgCarbs;
    private double avgFat;

    // Mục tiêu/ngày
    private double targetCalories;
    private double targetProtein;
    private double targetCarbs;
    private double targetFat;

    @Data
    @Builder
    public static class DayMacro {
        private String date;
        private double calories;
        private double protein;
        private double carbs;
        private double fat;
    }
}
