package com.example.Fitness.Service;

import com.example.Fitness.DTO.response.ProgressOverviewResponse;
import com.example.Fitness.Enum.FitnessGoal;
import com.example.Fitness.Model.Nutrition.DailyCheckin;
import com.example.Fitness.Model.Nutrition.WeightLog;
import com.example.Fitness.Model.User;
import com.example.Fitness.Model.WorkoutPlan;
import com.example.Fitness.Repository.RNutrition.DailyCheckinRepository;
import com.example.Fitness.Repository.RNutrition.FoodLogRepository;
import com.example.Fitness.Repository.RNutrition.WeightLogRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Repository.WorkoutLogRepository;
import com.example.Fitness.Repository.WorkoutPlanRepository;
import com.example.Fitness.Utils.HealthCalculatorUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Tính "Tiến độ so với kỳ vọng" (3 trụ): năng lượng, cân nặng, tuân thủ tập.
 * Dữ liệu lấy từ food_log (calo thực tế), weight_log, workoutlogs, daily_checkin.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ProgressService {

    private final UserRepository userRepository;
    private final FoodLogRepository foodLogRepository;
    private final WeightLogRepository weightLogRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final DailyCheckinRepository dailyCheckinRepository;

    public ProgressOverviewResponse getOverview() {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now();

        var energy = buildEnergy(user, today);
        var weight = buildWeight(user);
        var workout = buildWorkout(user, today);

        String overall = combineStatus(energy.getStatus(), weight.getStatus(), workout.getStatus());

        return ProgressOverviewResponse.builder()
                .overallStatus(overall)
                .message(buildMessage(overall, energy, weight, workout))
                .energy(energy).weight(weight).workout(workout)
                .build();
    }

    // ===== Trụ 1: Cân bằng năng lượng =====
    private ProgressOverviewResponse.Energy buildEnergy(User user, LocalDate today) {
        double target = computeTargetCalories(user);
        double tdee = computeTdee(user);

        // 7 ngày gần nhất
        List<Object[]> cur = foodLogRepository.sumMacrosByDateRange(user.getId(), today.minusDays(6), today);
        double sum = 0; int days = 0;
        for (Object[] r : cur) { sum += num(r[1]); days++; }
        double avg = days > 0 ? sum / days : 0;

        // Tuần trước để tính xu hướng
        List<Object[]> prev = foodLogRepository.sumMacrosByDateRange(user.getId(), today.minusDays(13), today.minusDays(7));
        double prevSum = 0; int prevDays = 0;
        for (Object[] r : prev) { prevSum += num(r[1]); prevDays++; }
        double prevAvg = prevDays > 0 ? prevSum / prevDays : 0;

        String trend = "STABLE";
        if (prevDays > 0 && days > 0) {
            if (avg > prevAvg * 1.05) trend = "UP";
            else if (avg < prevAvg * 0.95) trend = "DOWN";
        }

        String status;
        if (days == 0) status = "NO_DATA";
        else status = energyStatus(user.getFitnessGoal(), avg, target);

        int waterTarget = user.getWeight() != null ? (int) Math.round(user.getWeight() * 35) : 2000;
        int waterToday = dailyCheckinRepository.findByUserIdAndLogDate(user.getId(), today)
                .map(c -> c.getWaterMl() != null ? c.getWaterMl() : 0).orElse(0);

        return ProgressOverviewResponse.Energy.builder()
                .status(status)
                .avgIntake(round1(avg))
                .targetCalories(round1(target))
                .tdee(round1(tdee))
                .deficitSurplus(round1(avg - target))
                .trend(trend)
                .loggedDays(days)
                .waterMlToday(waterToday)
                .waterTarget(waterTarget)
                .build();
    }

    private String energyStatus(FitnessGoal goal, double avg, double target) {
        double ratio = avg / target;
        if (goal == FitnessGoal.LOSE_WEIGHT) {
            if (avg <= target * 1.05) return "ON_TRACK";
            if (avg <= target * 1.15) return "CAUTION";
            return "OFF_TRACK";
        } else if (goal == FitnessGoal.GAIN_WEIGHT || goal == FitnessGoal.MUSCLE_GAIN) {
            if (avg >= target * 0.95) return "ON_TRACK";
            if (avg >= target * 0.85) return "CAUTION";
            return "OFF_TRACK";
        } else { // giữ dáng / khác
            if (ratio >= 0.9 && ratio <= 1.1) return "ON_TRACK";
            if (ratio >= 0.8 && ratio <= 1.2) return "CAUTION";
            return "OFF_TRACK";
        }
    }

    // ===== Trụ 3: Cân nặng → mục tiêu =====
    private ProgressOverviewResponse.Weight buildWeight(User user) {
        List<WeightLog> logs = weightLogRepository.findByUserIdOrderByLogDateAsc(user.getId());
        Double target = user.getTargetWeight();
        Double current = !logs.isEmpty() ? logs.get(logs.size() - 1).getWeight() : user.getWeight();
        Double start = !logs.isEmpty() ? logs.get(0).getWeight() : user.getWeight();

        boolean hasData = target != null && current != null && start != null;
        if (!hasData) {
            return ProgressOverviewResponse.Weight.builder()
                    .hasData(false).status("NO_DATA")
                    .current(current).start(start).target(target).build();
        }

        Double progress = null;
        if (!start.equals(target)) {
            double p = (start - current) / (start - target) * 100.0;
            progress = Math.max(0, Math.min(100, round1(p)));
        } else {
            progress = 100.0;
        }

        Double weeklyRate = null;
        if (logs.size() >= 2) {
            WeightLog first = logs.get(0), last = logs.get(logs.size() - 1);
            long dayGap = Math.max(1, ChronoUnit.DAYS.between(first.getLogDate(), last.getLogDate()));
            weeklyRate = round1((last.getWeight() - first.getWeight()) / (dayGap / 7.0));
        }

        String status = weightStatus(user.getFitnessGoal(), weeklyRate);

        return ProgressOverviewResponse.Weight.builder()
                .hasData(true).status(status)
                .current(current).start(start).target(target)
                .progressPercent(progress).weeklyRate(weeklyRate)
                .build();
    }

    private String weightStatus(FitnessGoal goal, Double weeklyRate) {
        if (weeklyRate == null) return "CAUTION"; // có mục tiêu nhưng chưa đủ dữ liệu xu hướng
        boolean wantLose = goal == FitnessGoal.LOSE_WEIGHT;
        boolean wantGain = goal == FitnessGoal.GAIN_WEIGHT || goal == FitnessGoal.MUSCLE_GAIN;
        double abs = Math.abs(weeklyRate);
        if (wantLose) {
            if (weeklyRate < 0 && abs <= 1.0) return "ON_TRACK";   // giảm an toàn ≤1kg/tuần
            if (weeklyRate < 0) return "CAUTION";                  // giảm quá nhanh
            return "OFF_TRACK";                                    // không giảm / tăng
        } else if (wantGain) {
            if (weeklyRate > 0 && abs <= 0.75) return "ON_TRACK";
            if (weeklyRate > 0) return "CAUTION";
            return "OFF_TRACK";
        } else {
            return abs <= 0.5 ? "ON_TRACK" : "CAUTION"; // giữ dáng: dao động nhỏ
        }
    }

    // ===== Trụ 2: Tuân thủ tập luyện =====
    private ProgressOverviewResponse.Workout buildWorkout(User user, LocalDate today) {
        WorkoutPlan plan = workoutPlanRepository
                .findFirstByUserIdAndIsDefaultFalseAndIsDeletedFalseOrderByStartDateDesc(user.getId())
                .orElse(null);

        if (plan == null || plan.getDaysPerWeek() == null || plan.getDaysPerWeek() <= 0) {
            return ProgressOverviewResponse.Workout.builder()
                    .hasPlan(false).status("NO_DATA")
                    .planName(plan != null ? plan.getName() : null)
                    .sessionsThisWeek(0).targetPerWeek(0).build();
        }

        LocalDate monday = today.with(DayOfWeek.MONDAY);
        int sessions = safeInt(workoutLogRepository.countWorkoutDaysInRange(
                user.getId(), monday.atStartOfDay(), LocalDateTime.now()));
        int targetPerWeek = plan.getDaysPerWeek();
        double adherence = Math.min(100.0, (double) sessions / targetPerWeek * 100.0);

        String status = adherence >= 90 ? "ON_TRACK" : adherence >= 60 ? "CAUTION" : "OFF_TRACK";

        return ProgressOverviewResponse.Workout.builder()
                .hasPlan(true).status(status)
                .planName(plan.getName())
                .sessionsThisWeek(sessions)
                .targetPerWeek(targetPerWeek)
                .adherencePercent(round1(adherence))
                .build();
    }

    // ===== Ghi cân nặng & check-in =====
    public void logWeight(double weight, LocalDate date) {
        User user = getCurrentUser();
        LocalDate d = date != null ? date : LocalDate.now();
        WeightLog wl = weightLogRepository.findByUserIdAndLogDate(user.getId(), d)
                .orElse(WeightLog.builder().user(user).logDate(d).build());
        wl.setWeight(weight);
        weightLogRepository.save(wl);
        // Đồng bộ cân nặng hiện tại lên hồ sơ
        user.setWeight(weight);
        userRepository.save(user);
    }

    public void checkin(Integer waterMl, Boolean followedMenu, LocalDate date) {
        User user = getCurrentUser();
        LocalDate d = date != null ? date : LocalDate.now();
        DailyCheckin c = dailyCheckinRepository.findByUserIdAndLogDate(user.getId(), d)
                .orElse(DailyCheckin.builder().user(user).logDate(d).build());
        if (waterMl != null) c.setWaterMl(waterMl);
        if (followedMenu != null) c.setFollowedMenu(followedMenu);
        dailyCheckinRepository.save(c);
    }

    // ===== Helpers =====
    private String combineStatus(String... statuses) {
        boolean any = false, off = false, caution = false;
        for (String s : statuses) {
            if (s == null || s.equals("NO_DATA")) continue;
            any = true;
            if (s.equals("OFF_TRACK")) off = true;
            else if (s.equals("CAUTION")) caution = true;
        }
        if (!any) return "NO_DATA";
        if (off) return "OFF_TRACK";
        if (caution) return "CAUTION";
        return "ON_TRACK";
    }

    private String buildMessage(String overall, ProgressOverviewResponse.Energy e,
                                ProgressOverviewResponse.Weight w, ProgressOverviewResponse.Workout wo) {
        return switch (overall) {
            case "ON_TRACK" -> "Bạn đang đi đúng hướng — giữ vững nhé! 💪";
            case "CAUTION" -> "Bạn gần đạt kỳ vọng, cần chú ý thêm một chút.";
            case "OFF_TRACK" -> "Đang chệch hướng so với mục tiêu — hãy điều chỉnh ăn/tập.";
            default -> "Chưa đủ dữ liệu — hãy ghi nhật ký ăn, cân nặng và tập luyện để theo dõi.";
        };
    }

    private double computeTargetCalories(User user) {
        double tdee = computeTdee(user);
        FitnessGoal goal = user.getFitnessGoal();
        double t = tdee;
        if (goal != null) t = switch (goal) {
            case LOSE_WEIGHT -> tdee - 500;
            case GAIN_WEIGHT -> tdee + 500;
            case MUSCLE_GAIN -> tdee + 300;
            default -> tdee;
        };
        return Math.max(1200, t);
    }

    private double computeTdee(User user) {
        if (user.getWeight() == null || user.getHeight() == null || user.getDateOfBirth() == null)
            return 2000;
        int age = HealthCalculatorUtils.calculateAge(user.getDateOfBirth());
        double bmr = HealthCalculatorUtils.calculateBMR(user.getWeight(), user.getHeight(), age, user.getSex());
        return HealthCalculatorUtils.calculateTDEE(bmr, user.getActivityLevel());
    }

    private double num(Object o) { return o != null ? ((Number) o).doubleValue() : 0; }
    private int safeInt(Integer i) { return i != null ? i : 0; }
    private double round1(double v) { return Math.round(v * 10) / 10.0; }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }
}
