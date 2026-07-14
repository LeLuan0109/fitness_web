package com.example.Fitness.DTO.response;

import com.example.Fitness.DTO.response.Nutrition.MenuResponse;
import com.example.Fitness.Model.WorkoutPlan;
import com.example.Fitness.DTO.response.workout_plans.PlanResponse;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class SuggestionResponseDTO {
    private double bmi;
    private double tdee;
    private double targetCalories;

    private List<PlanResponse> suggestedWorkoutPlans;

    private List<MenuResponse> suggestedMenus;
}