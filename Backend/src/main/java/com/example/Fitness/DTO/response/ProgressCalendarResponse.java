package com.example.Fitness.DTO.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * Lịch tiến độ theo tháng: mỗi ngày gắn 1 trạng thái tập luyện + calo ăn/mục tiêu + cân nặng (nếu có).
 * status của từng ngày: COMPLETED | PARTIAL | MISSED | PLANNED | REST | NONE (không có kế hoạch nào phủ ngày đó)
 */
@Data
@Builder
public class ProgressCalendarResponse {
    private Summary summary;
    private List<DayCell> days;

    @Data
    @Builder
    public static class Summary {
        private Double currentWeight;
        private Double weightChangeTotal;   // current - start (âm = đã giảm)
        private Double weeklyRate;          // kg/tuần gần đây
        private Double avgCalories;         // TB calo ăn/ngày trong tháng (trên các ngày có log)
        private Double targetCalories;

        private int workoutSessionsDone;
        private int workoutSessionsTotal;   // số buổi có lịch trong tháng (đã tới hoặc qua ngày)
        private Double workoutAdherencePercent;

        private int mealDaysLogged;
        private int mealDaysTotal;          // số ngày đã qua trong tháng
        private Double mealAdherencePercent;

        private Double progressScore;       // 0-100, tổng hợp
        private String progressScoreLabel;  // vd: "Tuần tốt nhất", "Cần cố gắng thêm"...
    }

    @Data
    @Builder
    public static class DayCell {
        private LocalDate date;
        private List<DaySession> sessions; // rỗng = Nghỉ (không kế hoạch nào có buổi tập ngày đó)
        private Double caloriesEaten;
        private Double caloriesTarget;
        private Double weight;
    }

    /** 1 buổi tập của 1 kế hoạch cụ thể trong ngày — 1 ngày có thể có nhiều session nếu user theo nhiều kế hoạch song song. */
    @Data
    @Builder
    public static class DaySession {
        private Long planId;
        private String planName;
        private Long workoutDayId;
        private String sessionLabel;   // "Buổi 3"
        private String status;         // COMPLETED | PARTIAL | MISSED | PLANNED
    }
}
