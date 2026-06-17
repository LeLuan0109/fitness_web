package com.example.DoanBE.Utils;

import com.example.DoanBE.Enum.ActivityLevel;

import java.time.LocalDate;
import java.time.Period;

public class HealthCalculatorUtils {
    public static int calculateAge(LocalDate dateOfBirth) {
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }

    public static double calculateBMR(Double weight, Double height, int age, String sex) {
        if (weight == null || height == null) return 0;

        // Công thức: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + s
        double s = (sex != null && sex.equalsIgnoreCase("Male")) ? 5 : -161;

        return (10 * weight) + (6.25 * height) - (5 * age) + s;
    }

    // Tính TDEE (Total Daily Energy Expenditure)
    public static double calculateTDEE(double bmr, ActivityLevel activityLevel) {
        double r = 1.2; // Mặc định (Sedentary)

        if (activityLevel != null) {
            switch (activityLevel) {
                case LIGHTLY_ACTIVE -> r = 1.375;
                case MODERATELY_ACTIVE -> r = 1.55;
                case VERY_ACTIVE -> r = 1.725;
                case EXTRA_ACTIVE -> r = 1.9;
                default -> r = 1.2;
            }
        }
        return bmr * r;
    }

    // Tính Calo tiêu thụ của Bài tập (Dựa trên METs)
    // Công thức: Calories = METs * Weight (kg) * Duration (hours)
    public static float calculateExerciseCalories(Double met, Double userWeight, Integer durationSeconds) {
        if (met == null || userWeight == null || durationSeconds == null) return 0;

        double durationHours = durationSeconds / 3600.0;
        return (float) (met * userWeight * durationHours);
    }
}
