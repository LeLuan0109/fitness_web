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

    // Nhãn user dùng để đề xuất (minh bạch cho FE hiển thị)
    private String difficulty;         // độ khó phù hợp của user
    private boolean usedFallback;      // có phải nới điều kiện không (kho thiếu tổ hợp)

    // Lộ trình cân nặng (chỉ có nếu user đã khai targetWeight)
    private Double weightGap;              // (+): cần giảm, (-): cần tăng, đơn vị kg
    private Integer estimatedWeeksToGoal;  // số tuần ước tính đạt targetWeight với tốc độ an toàn
    private String paceWarning;            // cảnh báo nếu targetWeight ngược hướng với fitnessGoal

    // Giữ để tương thích ngược (đã sắp theo điểm giảm dần)
    private List<PlanResponse> suggestedWorkoutPlans;
    private List<MenuResponse> suggestedMenus;

    // Mới: kèm điểm khớp + lý do khớp
    private List<ScoredPlanSuggestion> workoutPlanSuggestions;
    private List<ScoredMenuSuggestion> menuSuggestions;
}