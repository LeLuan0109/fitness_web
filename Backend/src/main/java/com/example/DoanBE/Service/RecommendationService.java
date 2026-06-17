package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.response.SuggestionResponseDTO;
import com.example.DoanBE.DTO.response.Nutrition.MenuResponse;
import com.example.DoanBE.DTO.response.workout_plans.PlanResponse; // Import DTO này
import com.example.DoanBE.Enum.ActivityLevel;
import com.example.DoanBE.Enum.DifficultyLevel;
import com.example.DoanBE.Enum.FitnessGoal;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Mapper.MenuMapper;
import com.example.DoanBE.Mapper.WorkoutPlanMapper; // 1. Import Mapper
import com.example.DoanBE.Model.Nutrition.Menu;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Model.WorkoutPlan;
import com.example.DoanBE.Repository.RNutrition.MenuRepository;
import com.example.DoanBE.Repository.UserRepository;
import com.example.DoanBE.Repository.WorkoutPlanRepository;
import com.example.DoanBE.Utils.HealthCalculatorUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final MenuRepository menuRepository;
    private final MenuMapper menuMapper;
    private final WorkoutPlanMapper workoutPlanMapper;

    public SuggestionResponseDTO getRecommendation(Long userId) throws DataNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng với ID: " + userId));

        if (!user.checkOnboardingStatus()) {
            throw new IllegalArgumentException("Vui lòng cập nhật đầy đủ chỉ số cơ thể để nhận gợi ý.");
        }

        //  TÍNH TOÁN CHỈ SỐ
        int age = HealthCalculatorUtils.calculateAge(user.getDateOfBirth());
        double bmr = HealthCalculatorUtils.calculateBMR(user.getWeight(), user.getHeight(), age, user.getSex());
        double tdee = HealthCalculatorUtils.calculateTDEE(bmr, user.getActivityLevel());
        double bmi = user.getWeight() / Math.pow(user.getHeight() / 100.0, 2);

        double targetCalories = calculateTargetCalories(tdee, user.getFitnessGoal());
        DifficultyLevel difficulty = mapActivityToDifficulty(user.getActivityLevel());

        //  QUERY DATABASE

        List<WorkoutPlan> suggestedPlanEntities = workoutPlanRepository.findMatchingPlans(
                user.getFitnessGoal(), difficulty
        );

        float minCal = (float) (targetCalories - 200);
        float maxCal = (float) (targetCalories + 200);
        System.out.println("========== DEBUG RECOMMENDATION ==========");
        System.out.println("1. INPUTS:");
        System.out.println("   - User Goal: " + user.getFitnessGoal());
        System.out.println("   - Activity Level: " + user.getActivityLevel() + " -> Difficulty: " + difficulty);
        System.out.println("   - TDEE: " + tdee + " -> Target Calories: " + targetCalories);
        System.out.println("   - Menu Calorie Range: [" + minCal + " - " + maxCal + "]");

        System.out.println("2. QUERY RESULTS:");
        System.out.println("   - Plans Found: " + (suggestedPlanEntities != null ? suggestedPlanEntities.size() : 0));

        List<Menu> suggestedMenuEntities = menuRepository.findMenusByRange(user.getFitnessGoal(), minCal, maxCal);
        System.out.println("   - Menus Found: " + (suggestedMenuEntities != null ? suggestedMenuEntities.size() : 0));
        System.out.println("==========================================");
        //  MAP
        List<PlanResponse> suggestedPlanResponses = (suggestedPlanEntities != null)
                ? suggestedPlanEntities.stream()
                .map(workoutPlanMapper::toPlanResponse)
                .collect(Collectors.toList())
                : Collections.emptyList();

        List<MenuResponse> suggestedMenuResponses = (suggestedMenuEntities != null)
                ? suggestedMenuEntities.stream()
                .map(menuMapper::toMenuResponse)
                .collect(Collectors.toList())
                : Collections.emptyList();

        return SuggestionResponseDTO.builder()
                .bmi(Math.round(bmi * 100.0) / 100.0)
                .tdee(Math.round(tdee))
                .targetCalories(Math.round(targetCalories))
                .suggestedWorkoutPlans(suggestedPlanResponses)
                .suggestedMenus(suggestedMenuResponses)
                .build();
    }

    // --- Helper Methods ---
    private double calculateTargetCalories(double tdee, FitnessGoal goal) {
        if (goal == null) return tdee;
        return switch (goal) {
            case LOSE_WEIGHT -> tdee - 500;
            case GAIN_WEIGHT -> tdee + 500;
            case MUSCLE_GAIN -> tdee + 300;
            case SHAPE_BODY -> tdee;
            default -> tdee;
        };
    }

    private DifficultyLevel mapActivityToDifficulty(ActivityLevel activityLevel) {
        if (activityLevel == null) return DifficultyLevel.BEGINNER;
        return switch (activityLevel) {
            case SEDENTARY, LIGHTLY_ACTIVE -> DifficultyLevel.BEGINNER;
            case MODERATELY_ACTIVE -> DifficultyLevel.INTERMEDIATE;
            case VERY_ACTIVE, EXTRA_ACTIVE -> DifficultyLevel.ADVANCED;
        };
    }
}