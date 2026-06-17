package com.example.DoanBE.DTO.response.user;

import com.example.DoanBE.DTO.response.common.ChartDataResponseByDate;
import com.example.DoanBE.Enum.ActivityLevel;
import com.example.DoanBE.Enum.FitnessGoal;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String name;
    private String username;
    private String email;
    private String avatar;
    private String sex;
    private FitnessGoal fitnessGoal;
    private ActivityLevel activityLevel;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate dateOfBirth;

    private Double weight;
    private Double height;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime memberSince;

    private int totalWorkouts; // Tổng số buổi tập (All time)
    private double totalHours; // Tổng số giờ tập (All time)
    private double totalCalories; // Tổng calo (All time)

    private MonthlyStats monthlyStats;

    @Data
    @Builder
    public static class MonthlyStats {
        private String monthName;
        private int totalWorkouts;
        private int activeDays;
        private int currentStreak;
        private double totalDurationMin;
        private double avgDurationMin;
        private double totalCalories;

        // Dành cho biểu đồ (Graph)
        private List<ChartDataResponseByDate> chartData;
    }
}
