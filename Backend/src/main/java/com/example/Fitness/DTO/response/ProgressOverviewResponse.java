package com.example.Fitness.DTO.response;

import lombok.Builder;
import lombok.Data;

/**
 * Tiến độ so với kỳ vọng — 3 trụ + trạng thái tổng.
 * status: ON_TRACK (🟢) | CAUTION (🟡) | OFF_TRACK (🔴) | NO_DATA
 */
@Data
@Builder
public class ProgressOverviewResponse {
    private String overallStatus;
    private String message;

    private Energy energy;      // Trụ 1
    private Weight weight;      // Trụ 3
    private Workout workout;    // Trụ 2

    @Data @Builder
    public static class Energy {
        private String status;
        private double avgIntake;        // calo TB/ngày (7 ngày, tính trên ngày có log)
        private double targetCalories;   // calo mục tiêu theo goal
        private double tdee;             // calo duy trì
        private double deficitSurplus;   // avgIntake - target (âm = thâm hụt)
        private String trend;            // UP | DOWN | STABLE (so tuần trước)
        private int loggedDays;          // số ngày có ghi trong 7 ngày
        private int waterMlToday;
        private int waterTarget;
    }

    @Data @Builder
    public static class Weight {
        private boolean hasData;
        private String status;
        private Double current;
        private Double start;
        private Double target;
        private Double progressPercent;  // % chặng đường đã đi tới mục tiêu
        private Double weeklyRate;        // kg/tuần (âm = đang giảm)
    }

    @Data @Builder
    public static class Workout {
        private boolean hasPlan;
        private String status;
        private String planName;
        private int sessionsThisWeek;
        private int targetPerWeek;
        private Double adherencePercent;
    }
}
