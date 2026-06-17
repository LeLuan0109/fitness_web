package com.example.DoanBE.DTO.response.workout_logs;

import com.example.DoanBE.DTO.response.common.ChartDataResponseByDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkoutLogStatisticsResponse {
    private int totalWorkouts;
    private double totalCalories;
    private int currentStreak;
    private int longestStreak;
    private List<ChartDataResponseByDate> caloriesChart;
    private List<ChartDataResponseByDate> intensityChart;
}
