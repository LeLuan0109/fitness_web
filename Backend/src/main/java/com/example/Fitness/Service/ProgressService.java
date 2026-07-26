package com.example.Fitness.Service;

import com.example.Fitness.DTO.response.ProgressCalendarResponse;
import com.example.Fitness.DTO.response.ProgressDayDetailResponse;
import com.example.Fitness.DTO.response.ProgressOverviewResponse;
import com.example.Fitness.Enum.FitnessGoal;
import com.example.Fitness.Model.Nutrition.DailyCheckin;
import com.example.Fitness.Model.Nutrition.FoodLog;
import com.example.Fitness.Model.Nutrition.WeightLog;
import com.example.Fitness.Model.User;
import com.example.Fitness.Model.WorkoutDay;
import com.example.Fitness.Model.WorkoutDayExercises;
import com.example.Fitness.Model.WorkoutLogs;
import com.example.Fitness.Model.WorkoutPlan;
import com.example.Fitness.Repository.RNutrition.DailyCheckinRepository;
import com.example.Fitness.Repository.RNutrition.FoodLogRepository;
import com.example.Fitness.Repository.RNutrition.WeightLogRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Repository.WorkoutDayRepository;
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
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Tính "Tiến độ so với kỳ vọng" (3 trụ): năng lượng, cân nặng, tuân thủ tập.
 * Dữ liệu lấy từ food_log (calo thực tế), weight_log, workoutlogs, daily_checkin.
 */
@Service
@Transactional
@RequiredArgsConstructor
public class ProgressService {

    private static final java.time.ZoneId VN_ZONE = java.time.ZoneId.of("Asia/Ho_Chi_Minh");

    private final UserRepository userRepository;
    private final FoodLogRepository foodLogRepository;
    private final WeightLogRepository weightLogRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutDayRepository workoutDayRepository;
    private final DailyCheckinRepository dailyCheckinRepository;

    public ProgressOverviewResponse getOverview() {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now(VN_ZONE);

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

    // ===== Lịch tiến độ theo tháng (calendar dashboard) =====
    public ProgressCalendarResponse getCalendar(YearMonth month) {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now(VN_ZONE);
        LocalDate monthStart = month.atDay(1);
        LocalDate monthEnd = month.atEndOfMonth();

        // User có thể theo NHIỀU kế hoạch cá nhân song song — mỗi kế hoạch tự resolve lịch riêng
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserIdAndIsDefaultFalseAndIsDeletedFalse(user.getId());

        class PlanSchedule {
            WorkoutPlan plan;
            LocalDate weekAnchor;
            LocalDate planEnd;
            Map<String, WorkoutDay> dayLookup = new HashMap<>();
        }

        List<PlanSchedule> schedules = new ArrayList<>();
        for (WorkoutPlan plan : plans) {
            if (plan.getStartDate() == null || plan.getDurationWeek() == null) continue;
            PlanSchedule ps = new PlanSchedule();
            ps.plan = plan;
            ps.weekAnchor = plan.getStartDate().with(DayOfWeek.MONDAY);
            ps.planEnd = ps.weekAnchor.plusWeeks(plan.getDurationWeek()).minusDays(1);
            for (WorkoutDay wd : workoutDayRepository
                    .findByWorkoutPlanIdAndIsDeletedFalseOrderByWeekNumberAscDayInNumberAsc(plan.getId())) {
                ps.dayLookup.put(wd.getWeekNumber() + "-" + wd.getDayOfWeek(), wd);
            }
            schedules.add(ps);
        }

        double targetCalories = computeTargetCalories(user);

        Map<LocalDate, Double> caloriesByDate = new HashMap<>();
        for (Object[] r : foodLogRepository.sumMacrosByDateRange(user.getId(), monthStart, monthEnd)) {
            caloriesByDate.put((LocalDate) r[0], num(r[1]));
        }

        Map<LocalDate, Double> weightByDate = new HashMap<>();
        for (WeightLog wl : weightLogRepository.findByUserIdOrderByLogDateAsc(user.getId())) {
            if (!wl.getLogDate().isBefore(monthStart) && !wl.getLogDate().isAfter(monthEnd)) {
                weightByDate.put(wl.getLogDate(), wl.getWeight());
            }
        }

        List<ProgressCalendarResponse.DayCell> days = new ArrayList<>();
        int workoutSessionsTotal = 0, workoutSessionsDone = 0;
        int mealDaysTotal = 0, mealDaysLogged = 0;

        for (LocalDate d = monthStart; !d.isAfter(monthEnd); d = d.plusDays(1)) {
            List<ProgressCalendarResponse.DaySession> sessions = new ArrayList<>();

            for (PlanSchedule ps : schedules) {
                if (d.isBefore(ps.weekAnchor) || d.isAfter(ps.planEnd)) continue;
                int weekNumber = (int) ChronoUnit.WEEKS.between(ps.weekAnchor, d) + 1;
                int dow = d.getDayOfWeek().getValue();
                WorkoutDay wd = ps.dayLookup.get(weekNumber + "-" + dow);
                if (wd == null) continue; // kế hoạch này không có buổi tập ngày hôm đó (không phải REST chung, chỉ riêng kế hoạch này)

                boolean planActive = ps.plan.getIsActive() == null || ps.plan.getIsActive();
                // Trạng thái active/inactive chỉ ảnh hưởng tới TƯƠNG LAI — quá khứ/hôm nay luôn giữ nguyên
                // lịch sử thật đã diễn ra, không hồi tố theo trạng thái active hiện tại của kế hoạch.
                if (d.isAfter(today) && !planActive) continue;

                String status;
                int totalEx = countDistinctExercises(wd.getWorkoutDayExercises());
                workoutSessionsTotal++;

                if (d.isAfter(today)) {
                    status = "PLANNED";
                } else {
                    long loggedEx = workoutLogRepository.findByUserIdAndWorkoutDayId(user.getId(), wd.getId())
                            .stream().map(l -> l.getExercise().getId()).distinct().count();
                    if (totalEx > 0 && loggedEx >= totalEx) {
                        status = "COMPLETED";
                        workoutSessionsDone++;
                    } else if (loggedEx > 0) {
                        status = "PARTIAL";
                    } else {
                        status = d.isEqual(today) ? "PLANNED" : "MISSED";
                    }
                }

                sessions.add(ProgressCalendarResponse.DaySession.builder()
                        .planId(ps.plan.getId())
                        .planName(ps.plan.getName())
                        .workoutDayId(wd.getId())
                        .sessionLabel("Buổi " + wd.getDayInNumber())
                        .status(status)
                        .build());
            }

            Double calEaten = caloriesByDate.get(d);
            if (!d.isAfter(today)) {
                mealDaysTotal++;
                if (calEaten != null) mealDaysLogged++;
            }

            days.add(ProgressCalendarResponse.DayCell.builder()
                    .date(d)
                    .sessions(sessions)
                    .caloriesEaten(calEaten != null ? round1(calEaten) : null)
                    .caloriesTarget(round1(targetCalories))
                    .weight(weightByDate.get(d))
                    .build());
        }

        ProgressCalendarResponse.Summary summary = buildCalendarSummary(
                user, today, targetCalories, caloriesByDate,
                workoutSessionsDone, workoutSessionsTotal, mealDaysLogged, mealDaysTotal);

        return ProgressCalendarResponse.builder().summary(summary).days(days).build();
    }

    private ProgressCalendarResponse.Summary buildCalendarSummary(
            User user, LocalDate today, double targetCalories, Map<LocalDate, Double> caloriesByDate,
            int workoutSessionsDone, int workoutSessionsTotal, int mealDaysLogged, int mealDaysTotal) {

        List<WeightLog> allWeightLogs = weightLogRepository.findByUserIdOrderByLogDateAsc(user.getId());
        Double currentWeight = !allWeightLogs.isEmpty()
                ? allWeightLogs.get(allWeightLogs.size() - 1).getWeight() : user.getWeight();
        Double startWeight = !allWeightLogs.isEmpty() ? allWeightLogs.get(0).getWeight() : null;
        Double weightChangeTotal = (currentWeight != null && startWeight != null) ? round1(currentWeight - startWeight) : null;

        Double weeklyRate = null;
        if (allWeightLogs.size() >= 2) {
            WeightLog first = allWeightLogs.get(0), last = allWeightLogs.get(allWeightLogs.size() - 1);
            long dayGap = Math.max(1, ChronoUnit.DAYS.between(first.getLogDate(), last.getLogDate()));
            weeklyRate = round1((last.getWeight() - first.getWeight()) / (dayGap / 7.0));
        }

        double avgCalories = 0;
        if (!caloriesByDate.isEmpty()) {
            avgCalories = caloriesByDate.values().stream().mapToDouble(Double::doubleValue).sum() / caloriesByDate.size();
        }

        double workoutAdherence = workoutSessionsTotal > 0 ? (double) workoutSessionsDone / workoutSessionsTotal * 100 : 0;
        double mealAdherence = mealDaysTotal > 0 ? (double) mealDaysLogged / mealDaysTotal * 100 : 0;
        double energyScore = avgCalories > 0
                ? Math.max(0, 100 - Math.abs(avgCalories - targetCalories) / targetCalories * 100)
                : 0;

        double progressScore = round1(workoutAdherence * 0.4 + mealAdherence * 0.3 + energyScore * 0.3);
        String label;
        if (progressScore >= 85) label = "Tuần tốt nhất 🔥";
        else if (progressScore >= 65) label = "Đang tiến bộ tốt";
        else if (progressScore >= 40) label = "Cần cố gắng thêm";
        else label = "Chưa đủ dữ liệu / cần bắt đầu lại";

        return ProgressCalendarResponse.Summary.builder()
                .currentWeight(currentWeight)
                .weightChangeTotal(weightChangeTotal)
                .weeklyRate(weeklyRate)
                .avgCalories(round1(avgCalories))
                .targetCalories(round1(targetCalories))
                .workoutSessionsDone(workoutSessionsDone)
                .workoutSessionsTotal(workoutSessionsTotal)
                .workoutAdherencePercent(round1(workoutAdherence))
                .mealDaysLogged(mealDaysLogged)
                .mealDaysTotal(mealDaysTotal)
                .mealAdherencePercent(round1(mealAdherence))
                .progressScore(progressScore)
                .progressScoreLabel(label)
                .build();
    }

    // ===== Chi tiết 1 ngày (tooltip/panel khi click vào ô lịch) =====
    public ProgressDayDetailResponse getDayDetail(LocalDate date, Long workoutDayId) {
        User user = getCurrentUser();
        LocalDate today = LocalDate.now(VN_ZONE);

        String status = "NONE";
        String planDayLabel = null;
        List<ProgressDayDetailResponse.ExerciseItem> exerciseItems = new ArrayList<>();

        WorkoutDay matchedDay = null;
        if (workoutDayId != null) {
            // Ngày có thể có nhiều buổi (nhiều kế hoạch song song) — client chỉ định đúng buổi muốn xem
            matchedDay = workoutDayRepository.findById(workoutDayId).orElse(null);
        } else {
            WorkoutPlan plan = workoutPlanRepository
                    .findFirstByUserIdAndIsDefaultFalseAndIsDeletedFalseOrderByStartDateDesc(user.getId())
                    .orElse(null);
            if (plan != null && plan.getStartDate() != null && plan.getDurationWeek() != null) {
                LocalDate planWeekAnchor = plan.getStartDate().with(DayOfWeek.MONDAY);
                LocalDate planEnd = planWeekAnchor.plusWeeks(plan.getDurationWeek()).minusDays(1);
                if (!date.isBefore(planWeekAnchor) && !date.isAfter(planEnd)) {
                    int weekNumber = (int) ChronoUnit.WEEKS.between(planWeekAnchor, date) + 1;
                    int dow = date.getDayOfWeek().getValue();
                    matchedDay = workoutDayRepository
                            .findByWorkoutPlanIdAndIsDeletedFalseOrderByWeekNumberAscDayInNumberAsc(plan.getId())
                            .stream()
                            .filter(wd -> wd.getWeekNumber() == weekNumber && wd.getDayOfWeek() == dow)
                            .findFirst().orElse(null);
                }
            }
        }

        {
                if (matchedDay == null) {
                    status = "REST";
                } else {
                    planDayLabel = "Buổi " + matchedDay.getDayInNumber();
                    List<WorkoutLogs> logs = workoutLogRepository
                            .findByUserIdAndWorkoutDayId(user.getId(), matchedDay.getId());
                    Map<Long, Long> loggedSetsByExercise = new HashMap<>();
                    for (WorkoutLogs l : logs) {
                        loggedSetsByExercise.merge(l.getExercise().getId(), 1L, Long::sum);
                    }

                    int totalEx = 0, doneEx = 0;
                    for (WorkoutDayExercises wde : matchedDay.getWorkoutDayExercises()) {
                        totalEx++;
                        long logged = loggedSetsByExercise.getOrDefault(wde.getExercises().getId(), 0L);
                        boolean done = logged > 0 && (wde.getSets() == null || logged >= wde.getSets());
                        if (done) doneEx++;
                        exerciseItems.add(ProgressDayDetailResponse.ExerciseItem.builder()
                                .exerciseId(wde.getExercises().getId())
                                .exerciseName(wde.getExercises().getName())
                                .setsPlanned(wde.getSets() != null ? wde.getSets() : 0)
                                .setsLogged((int) logged)
                                .done(done)
                                .build());
                    }

                    if (date.isAfter(today)) status = "PLANNED";
                    else if (totalEx > 0 && doneEx >= totalEx) status = "COMPLETED";
                    else if (doneEx > 0) status = "PARTIAL";
                    else status = date.isEqual(today) ? "PLANNED" : "MISSED";
                }
        }

        List<FoodLog> foodLogs = foodLogRepository.findByUserAndDate(user.getId(), date);
        List<ProgressDayDetailResponse.MealItem> mealItems = new ArrayList<>();
        double caloriesEaten = 0;
        for (FoodLog f : foodLogs) {
            String name = f.getDish() != null ? f.getDish().getName() : f.getCustomName();
            double cal = f.getActualCalories() != null ? f.getActualCalories()
                    : (f.getDish() != null && f.getDish().getCalories() != null
                        ? f.getDish().getCalories() * (f.getQuantity() != null ? f.getQuantity() : 1) : 0);
            caloriesEaten += cal;
            mealItems.add(ProgressDayDetailResponse.MealItem.builder()
                    .name(name).calories(round1(cal)).mealType(f.getMealType())
                    .build());
        }

        Double weight = weightLogRepository.findByUserIdAndLogDate(user.getId(), date)
                .map(WeightLog::getWeight).orElse(null);

        return ProgressDayDetailResponse.builder()
                .date(date)
                .status(status)
                .planDayLabel(planDayLabel)
                .exercises(exerciseItems)
                .meals(mealItems)
                .caloriesEaten(round1(caloriesEaten))
                .caloriesTarget(round1(computeTargetCalories(user)))
                .weight(weight)
                .build();
    }

    private int countDistinctExercises(List<WorkoutDayExercises> list) {
        if (list == null) return 0;
        return (int) list.stream().map(e -> e.getExercises().getId()).distinct().count();
    }

    // ===== Ghi cân nặng & check-in =====
    public void logWeight(double weight, LocalDate date) {
        User user = getCurrentUser();
        LocalDate d = date != null ? date : LocalDate.now(VN_ZONE);
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
        LocalDate d = date != null ? date : LocalDate.now(VN_ZONE);
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
