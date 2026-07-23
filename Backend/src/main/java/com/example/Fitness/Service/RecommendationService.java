package com.example.Fitness.Service;

import com.example.Fitness.DTO.response.ScoredMenuSuggestion;
import com.example.Fitness.DTO.response.ScoredPlanSuggestion;
import com.example.Fitness.DTO.response.SuggestionResponseDTO;
import com.example.Fitness.DTO.response.Nutrition.MenuResponse;
import com.example.Fitness.DTO.response.workout_plans.PlanResponse;
import com.example.Fitness.Enum.ActivityLevel;
import com.example.Fitness.Enum.DifficultyLevel;
import com.example.Fitness.Enum.FitnessGoal;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Mapper.MenuMapper;
import com.example.Fitness.Mapper.WorkoutPlanMapper;
import com.example.Fitness.Model.Nutrition.Menu;
import com.example.Fitness.Model.User;
import com.example.Fitness.Model.WorkoutPlan;
import com.example.Fitness.Repository.RNutrition.MenuRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Repository.WorkoutPlanRepository;
import com.example.Fitness.Utils.HealthCalculatorUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Recommendation Engine nâng cấp: Hard Filter (an toàn) → Scoring (độ khớp) → Ranking + Fallback.
 * Trả về Top N kèm "lý do khớp" sinh tự động từ điểm.
 *
 * Ghi chú: các ràng buộc an toàn (chấn thương/dị ứng/dụng cụ) được đặt sẵn hook ở bước Hard Filter;
 * hiện chưa thu thập các dữ liệu đó nên bước này là no-op, sẽ kích hoạt khi bổ sung onboarding.
 */
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final int TOP_N = 5;

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

        // ===== 1. TÍNH VALUE KEY & USER LABEL =====
        int age = HealthCalculatorUtils.calculateAge(user.getDateOfBirth());
        double bmr = HealthCalculatorUtils.calculateBMR(user.getWeight(), user.getHeight(), age, user.getSex());
        double tdee = HealthCalculatorUtils.calculateTDEE(bmr, user.getActivityLevel());
        double bmi = user.getWeight() / Math.pow(user.getHeight() / 100.0, 2);

        double targetCalories = calculateTargetCalories(tdee, user.getFitnessGoal());
        DifficultyLevel userDifficulty = resolveUserDifficulty(user);
        double proteinTarget = targetCalories * 0.30 / 4.0; // g

        // ===== 2. SCORING KẾ HOẠCH (goal-matched trước, fallback nếu rỗng) =====
        List<WorkoutPlan> allPlans = workoutPlanRepository.findByIsDefaultTrueAndIsDeletedFalse();
        List<WorkoutPlan> planPool = allPlans.stream()
                .filter(p -> p.getTargetGoal() == user.getFitnessGoal())
                .collect(Collectors.toList());
        boolean planFallback = false;
        if (planPool.isEmpty()) {            // Fallback: kho không có plan đúng goal → nới điều kiện
            planPool = allPlans;
            planFallback = !allPlans.isEmpty();
        }
        List<ScoredPlanSuggestion> scoredPlans = planPool.stream()
                .map(p -> scorePlan(p, user.getFitnessGoal(), userDifficulty, user.getDaysPerWeekAvailable()))
                .sorted(Comparator.comparingInt(ScoredPlanSuggestion::getMatchScore).reversed())
                .limit(TOP_N)
                .collect(Collectors.toList());

        // ===== 3. SCORING THỰC ĐƠN =====
        List<Menu> allMenus = menuRepository.findByIsDefaultTrueAndIsDeletedFalse();
        List<Menu> menuPool = allMenus.stream()
                .filter(m -> m.getFitnessGoal() == user.getFitnessGoal())
                .collect(Collectors.toList());
        boolean menuFallback = false;
        if (menuPool.isEmpty()) {
            menuPool = allMenus;
            menuFallback = !allMenus.isEmpty();
        }
        List<ScoredMenuSuggestion> scoredMenus = menuPool.stream()
                .map(m -> scoreMenu(m, user.getFitnessGoal(), targetCalories, proteinTarget))
                .sorted(Comparator.comparingInt(ScoredMenuSuggestion::getMatchScore).reversed())
                .limit(TOP_N)
                .collect(Collectors.toList());

        return SuggestionResponseDTO.builder()
                .bmi(Math.round(bmi * 100.0) / 100.0)
                .tdee(Math.round(tdee))
                .targetCalories(Math.round(targetCalories))
                .difficulty(userDifficulty.name())
                .usedFallback(planFallback || menuFallback)
                .workoutPlanSuggestions(scoredPlans)
                .menuSuggestions(scoredMenus)
                .suggestedWorkoutPlans(scoredPlans.stream().map(ScoredPlanSuggestion::getPlan).collect(Collectors.toList()))
                .suggestedMenus(scoredMenus.stream().map(ScoredMenuSuggestion::getMenu).collect(Collectors.toList()))
                .build();
    }

    // ===== SCORING =====

    private ScoredPlanSuggestion scorePlan(WorkoutPlan p, FitnessGoal goal,
                                           DifficultyLevel userDiff, Integer daysAvailable) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        // Hard filter hook (an toàn) — hiện chưa có dữ liệu chấn thương/dụng cụ nên bỏ qua.

        if (p.getTargetGoal() == goal) {
            score += 40;
            reasons.add("✅ Đúng mục tiêu " + viGoal(goal));
        } else {
            reasons.add("⚠️ Khác mục tiêu của bạn");
        }

        if (p.getDifficultyLevel() != null && userDiff != null) {
            int gap = Math.abs(ordinal(p.getDifficultyLevel()) - ordinal(userDiff));
            int add = gap == 0 ? 25 : gap == 1 ? 12 : 0;
            score += add;
            if (gap == 0) reasons.add("✅ Đúng trình độ " + viDiff(userDiff));
            else if (gap == 1) reasons.add("⚠️ Lệch nhẹ trình độ (" + viDiff(p.getDifficultyLevel()) + ")");
            else reasons.add("⚠️ Lệch nhiều trình độ (" + viDiff(p.getDifficultyLevel()) + ")");
        }

        if (daysAvailable != null && p.getDaysPerWeek() != null) {
            int gap = Math.abs(p.getDaysPerWeek() - daysAvailable);
            int add = gap == 0 ? 15 : gap == 1 ? 10 : gap == 2 ? 5 : 0;
            score += add;
            if (gap == 0) reasons.add("✅ " + p.getDaysPerWeek() + " buổi/tuần khớp lịch của bạn");
            else reasons.add("⚠️ " + p.getDaysPerWeek() + " buổi/tuần (bạn rảnh " + daysAvailable + ")");
        }

        return ScoredPlanSuggestion.builder()
                .plan(workoutPlanMapper.toPlanResponse(p))
                .matchScore(score)
                .reasons(reasons)
                .build();
    }

    private ScoredMenuSuggestion scoreMenu(Menu m, FitnessGoal goal, double targetCal, double proteinTarget) {
        int score = 0;
        List<String> reasons = new ArrayList<>();

        // Hard filter hook (dị ứng/chế độ ăn) — hiện chưa có dữ liệu nên bỏ qua.

        if (m.getFitnessGoal() == goal) {
            score += 40;
            reasons.add("✅ Đúng mục tiêu " + viGoal(goal));
        } else {
            reasons.add("⚠️ Khác mục tiêu của bạn");
        }

        Float cal = m.getCaloriesTarget() != null ? m.getCaloriesTarget()
                : (m.getCalories() != null ? m.getCalories() : null);
        if (cal != null) {
            double diff = Math.abs(cal - targetCal);
            int add = (int) Math.round(Math.max(0, 30 - (diff / 400.0) * 30)); // >400 kcal lệch → 0
            score += add;
            if (diff <= 100) reasons.add("✅ Calo sát mục tiêu (" + Math.round(cal) + " kcal)");
            else reasons.add("⚠️ Calo lệch mục tiêu (" + Math.round(cal) + " vs " + Math.round(targetCal) + ")");
        }

        if (m.getProtein() != null && proteinTarget > 0) {
            double diff = Math.abs(m.getProtein() - proteinTarget);
            int add = (int) Math.round(Math.max(0, 20 - (diff / 60.0) * 20));
            score += add;
            if (add >= 12) reasons.add("✅ Lượng đạm phù hợp (" + Math.round(m.getProtein()) + "g)");
        }

        return ScoredMenuSuggestion.builder()
                .menu(menuMapper.toMenuResponse(m))
                .matchScore(score)
                .reasons(reasons)
                .build();
    }

    // ===== Helpers =====

    /** Ưu tiên kinh nghiệm tập (experience_level); nếu chưa khai → suy từ mức vận động (PAL). */
    private DifficultyLevel resolveUserDifficulty(User user) {
        if (user.getExperienceLevel() != null) {
            return user.getExperienceLevel().getMappedDifficulty();
        }
        return mapActivityToDifficulty(user.getActivityLevel());
    }

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

    private int ordinal(DifficultyLevel d) {
        return switch (d) { case BEGINNER -> 1; case INTERMEDIATE -> 2; case ADVANCED -> 3; };
    }

    private String viDiff(DifficultyLevel d) {
        return switch (d) { case BEGINNER -> "Người mới"; case INTERMEDIATE -> "Trung bình"; case ADVANCED -> "Nâng cao"; };
    }

    private String viGoal(FitnessGoal g) {
        if (g == null) return "";
        return switch (g) {
            case LOSE_WEIGHT -> "giảm cân";
            case GAIN_WEIGHT -> "tăng cân";
            case MUSCLE_GAIN -> "tăng cơ";
            case SHAPE_BODY -> "giữ dáng";
            default -> "khác";
        };
    }
}
