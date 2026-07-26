package com.example.Fitness.DTO.response.Nutrition;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Lịch nhật ký ăn theo khoảng ngày: mỗi ngày gắn % hoàn thành thực đơn (số bữa đã ghi / số bữa dự kiến).
 */
@Data
@Builder
public class FoodDiaryCalendarResponse {
    private List<DayCell> days;

    @Data
    @Builder
    public static class DayCell {
        private String date;      // yyyy-MM-dd
        private double completionPercent;
        private int mealsLogged;
        private int mealsPlanned;
    }
}
