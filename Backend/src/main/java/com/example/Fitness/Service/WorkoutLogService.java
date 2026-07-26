package com.example.Fitness.Service;

import com.example.Fitness.DTO.request.LogWorkoutRequest;
import com.example.Fitness.DTO.request.WorkoutLogSearchRequest;
import com.example.Fitness.DTO.response.common.ChartDataResponseByDate;
import com.example.Fitness.DTO.response.workout_logs.ExerciseHistorySummary;
import com.example.Fitness.DTO.response.workout_logs.WorkoutHistoryResponse;
import com.example.Fitness.DTO.response.workout_logs.WorkoutLogResponse;
import com.example.Fitness.DTO.response.workout_logs.WorkoutLogStatisticsResponse;
import com.example.Fitness.DTO.response.workout_logs.WorkoutSessionDetailResponse;
import com.example.Fitness.DTO.response.workout_logs.WorkoutSessionSummaryResponse;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Mapper.WorkoutLogMapper;
import com.example.Fitness.Model.ExerciseMuscleGroup;
import com.example.Fitness.Model.Exercises;
import com.example.Fitness.Model.User;
import com.example.Fitness.Model.WorkoutDay;
import com.example.Fitness.Model.WorkoutDayExercises;
import com.example.Fitness.Model.WorkoutLogs;
import com.example.Fitness.Repository.ExerciseRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Repository.WorkoutDayRepository;
import com.example.Fitness.Repository.WorkoutLogRepository;
import com.example.Fitness.Utils.HealthCalculatorUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class WorkoutLogService {
    private static final java.time.ZoneId VN_ZONE = java.time.ZoneId.of("Asia/Ho_Chi_Minh");

    private final WorkoutLogRepository workoutLogRepository;
    private final UserRepository userRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutDayRepository workoutDayRepository;
    private final WorkoutLogMapper workoutLogMapper;

    public WorkoutLogResponse logSet(LogWorkoutRequest request) throws DataNotFoundException{
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng"));

        Exercises exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bài tập"));
        WorkoutDay workoutDay = null;
        if (request.getWorkoutDayId() != null) {
            workoutDay = workoutDayRepository.findById(request.getWorkoutDayId())
                    .orElse(null);
        }
        double met = exercise.getMet() != null ? exercise.getMet() : 3.5;
        float calories = HealthCalculatorUtils.calculateExerciseCalories(
                met,
                user.getWeight(),
                (int)(request.getDuration() != null ? request.getDuration() : 0)
        );
        updateUserStreak(user);
        WorkoutLogs log = WorkoutLogs.builder()
                .user(user)
                .exercise(exercise)
                .workoutDay(workoutDay)
                .setNumber(request.getSetNumber())
                .actualReps(request.getReps())
                .actualWeights(request.getWeight())
                .actualDuration((int)(request.getDuration() != null ? request.getDuration() : 0))
                .caloriesBurned(calories)
                .poseQuality(request.getPoseQuality())
                .build();
        WorkoutLogs savedWorkoutLogs = workoutLogRepository.save(log);
        return workoutLogMapper.toWorkoutLogResponse(savedWorkoutLogs);
    }

    public List<WorkoutLogResponse> getLogsByDate(LocalDate date) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tạo khoảng thời gian đầu ngày và cuối ngày
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59);

        List<WorkoutLogs> logs = workoutLogRepository.findLogsByUserIdAndDateRange(user.getId(), start, end);

        // Map sang DTO
        return workoutLogMapper.toWorkoutLogResponseList(logs);
    }

    public List<WorkoutHistoryResponse> getWorkoutHistory(WorkoutLogSearchRequest request) throws DataNotFoundException{
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng"));

        if (request.getFromDate() != null && request.getToDate() != null && request.getFromDate().isAfter(request.getToDate())) {
            throw new RuntimeException("Ngày bắt đầu không được lớn hơn ngày kết thúc");
        }

        // Tìm từ đầu ngày (00:00:00) của fromDate
        LocalDateTime start = (request.getFromDate() != null) ? request.getFromDate().atStartOfDay() : null;
        // Tìm đến cuối ngày (23:59:59) của toDate
        LocalDateTime end = (request.getToDate() != null) ? request.getToDate().atTime(LocalTime.MAX) : null;

        List<WorkoutLogs> rawLogs = workoutLogRepository.searchLogs(
                user.getId(),
                start,
                end,
                request.getExerciseId()
        );

        // Gom nhóm dữ liệu theo Ngày -> Bài tập
        Map<LocalDate, List<WorkoutLogs>> logsByDateMap = rawLogs.stream()
                .collect(Collectors.groupingBy(log -> log.getCreatedAt().toLocalDate()));
        List<WorkoutHistoryResponse> responseList = new ArrayList<>();
        // Sắp xếp ngày giảm dần (Mới nhất lên đầu)
        logsByDateMap.keySet().stream()
                .sorted(Comparator.reverseOrder())
                .forEach(date -> {
                    List<WorkoutLogs> logsInDay = logsByDateMap.get(date);
                    Map<Long, List<WorkoutLogs>> logsByExerciseMap = logsInDay.stream()
                            .collect(Collectors.groupingBy(
                                    log -> log.getExercise().getId(),
                                    LinkedHashMap::new,
                                    Collectors.toList()
                            ));

                    List<ExerciseHistorySummary> exerciseSummaries = new ArrayList<>();
                    float dailyCalories = 0;

                    for (List<WorkoutLogs> exLogs : logsByExerciseMap.values()) {
                        WorkoutLogs firstLog = exLogs.get(0);

                        // Tính tổng hợp
                        int totalSets = exLogs.size();
                        int totalReps = exLogs.stream().mapToInt(l -> l.getActualReps() != null ? l.getActualReps() : 0).sum();
                        int totalDuration = exLogs.stream().mapToInt(l -> l.getActualDuration() != null ? l.getActualDuration() : 0).sum();
                        float totalCal = (float) exLogs.stream().mapToDouble(l -> l.getCaloriesBurned() != null ? l.getCaloriesBurned() : 0).sum();
                        // tổng ngày
                        dailyCalories += totalCal;
                        exerciseSummaries.add(ExerciseHistorySummary.builder()
                                .exerciseId(firstLog.getExercise().getId())
                                .exerciseName(firstLog.getExercise().getName())
                                .thumbnail(firstLog.getExercise().getThumbnail())
                                .totalSets(totalSets)
                                .totalReps(totalReps)
                                .totalDurations(totalDuration)
                                .totalCalories(totalCal)
                                .build());
                    }
                    responseList.add(WorkoutHistoryResponse.builder()
                            .date(date)
                            .totalExercises(logsByExerciseMap.size())
                            .totalCalories(dailyCalories)
                            .exercises(exerciseSummaries)
                            .build());
                });

        return responseList;
    }

    public List<WorkoutLogResponse> getLogsByDayAndExercise(Long workoutDayId, Long exerciseId) throws DataNotFoundException {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng"));

        List<WorkoutLogs> logs = workoutLogRepository.findByWorkoutDayAndExercise(
                user.getId(),
                workoutDayId,
                exerciseId
        );

        return workoutLogMapper.toWorkoutLogResponseList(logs);
    }

    public WorkoutLogStatisticsResponse getWorkoutLogStatistics() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Double totalCalories = workoutLogRepository.sumTotalCaloriesByUserId(user.getId());
        Integer totalWorkouts = workoutLogRepository.countTotalWorkoutsByUserId(user.getId());

        LocalDate endDateLog = LocalDate.now(VN_ZONE);
        LocalDate startDateLog = endDateLog.minusDays(9);

        LocalDateTime startDateTime = startDateLog.atStartOfDay();
        LocalDateTime endDateTime = endDateLog.atTime(LocalTime.MAX);

        List<Object[]> caloriesDataRaw = workoutLogRepository.getCaloriesChartData(user.getId(), startDateTime, endDateTime);
        List<Object[]> intensityDataRaw = workoutLogRepository.getIntensityChartData(user.getId(), startDateTime, endDateTime);

        List<ChartDataResponseByDate> caloriesChart = mapToChartData(caloriesDataRaw);
        List<ChartDataResponseByDate> intensityChart = mapToChartData(intensityDataRaw);

        return WorkoutLogStatisticsResponse.builder()
                .totalWorkouts(totalWorkouts != null ? totalWorkouts : 0)
                .totalCalories(totalCalories != null ? totalCalories : 0.0)
                .currentStreak(user.getCurrentStreak() != null ? user.getCurrentStreak() : 0)
                .longestStreak(user.getLongestStreak() != null ? user.getLongestStreak() : 0)
                .caloriesChart(caloriesChart)
                .intensityChart(intensityChart)
                .build();
    }

    private void updateUserStreak(User user) {
        LocalDate today = LocalDate.now(VN_ZONE);
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.atTime(LocalTime.MAX);
        boolean hasLoggedToday = workoutLogRepository.existsByUserIdAndCreatedAtBetween(
                user.getId(), startOfToday, endOfToday
        );
        if (hasLoggedToday) {
            return;
        }
        LocalDate yesterday = today.minusDays(1);
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = yesterday.atTime(LocalTime.MAX);

        boolean hasLoggedYesterday = workoutLogRepository.existsByUserIdAndCreatedAtBetween(
                user.getId(), startOfYesterday, endOfYesterday
        );
        int currentStreak = (user.getCurrentStreak() == null) ? 0 : user.getCurrentStreak();
        int longestStreak = (user.getLongestStreak() == null) ? 0 : user.getLongestStreak();
        if (hasLoggedYesterday) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }
        user.setCurrentStreak(currentStreak);
        user.setLongestStreak(longestStreak);
        userRepository.save(user);
    }

    private List<ChartDataResponseByDate> mapToChartData(List<Object[]> rawData) {
        if (rawData == null) return new ArrayList<>();

        return rawData.stream().map(obj -> {
            LocalDate date;
            if (obj[0] instanceof java.sql.Date) {
                date = ((java.sql.Date) obj[0]).toLocalDate();
            } else {
                date = (LocalDate) obj[0];
            }

            Double v1 = (obj.length > 1 && obj[1] != null)
                    ? ((Number) obj[1]).doubleValue()
                    : null;

            Double v2 = (obj.length > 2 && obj[2] != null)
                    ? ((Number) obj[2]).doubleValue()
                    : null;

            return ChartDataResponseByDate.builder()
                    .date(date)
                    .value1(v1)
                    .value2(v2)
                    .build();
        }).collect(Collectors.toList());
    }

    // ===== Feature: Theo dõi tiến bộ sức mạnh (Progress + PR) =====

    /** Danh sách bài tập mà user đã từng log (đổ vào dropdown chọn bài xem tiến bộ). */
    public List<Map<String, Object>> getLoggedExercises() {
        User user = getCurrentUserOrThrow();
        List<Object[]> rows = workoutLogRepository.findLoggedExercisesByUser(user.getId());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] r : rows) {
            Map<String, Object> m = new HashMap<>();
            m.put("id", ((Number) r[0]).longValue());
            m.put("name", r[1]);
            result.add(m);
        }
        return result;
    }

    /** Tiến bộ của 1 bài tập theo thời gian + kỷ lục cá nhân (PR). */
    public com.example.Fitness.DTO.response.workout_logs.ExerciseProgressResponse getExerciseProgress(
            Long exerciseId, LocalDate fromDate, LocalDate toDate) throws DataNotFoundException {
        User user = getCurrentUserOrThrow();
        Exercises exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bài tập"));

        LocalDateTime start = (fromDate != null) ? fromDate.atStartOfDay() : null;
        LocalDateTime end = (toDate != null) ? toDate.atTime(LocalTime.MAX) : null;

        List<Object[]> rows = workoutLogRepository.getExerciseProgress(user.getId(), exerciseId, start, end);

        List<com.example.Fitness.DTO.response.workout_logs.ExerciseProgressResponse.ProgressPoint> points = new ArrayList<>();
        double bestWeight = 0;
        int bestReps = 0;
        double bestOneRm = 0;
        String bestDate = null;

        for (Object[] r : rows) {
            String day = String.valueOf(r[0]);
            double maxWeight = (r[1] != null) ? ((Number) r[1]).doubleValue() : 0;
            int maxReps = (r[2] != null) ? ((Number) r[2]).intValue() : 0;
            double oneRm = (r[3] != null) ? ((Number) r[3]).doubleValue() : 0;
            double volume = (r[4] != null) ? ((Number) r[4]).doubleValue() : 0;

            points.add(com.example.Fitness.DTO.response.workout_logs.ExerciseProgressResponse.ProgressPoint.builder()
                    .date(day)
                    .maxWeight(maxWeight)
                    .maxReps(maxReps)
                    .estimatedOneRm(Math.round(oneRm * 10) / 10.0)
                    .volume(volume)
                    .build());

            if (maxWeight > bestWeight) {
                bestWeight = maxWeight;
                bestDate = day;
            }
            if (maxReps > bestReps) bestReps = maxReps;
            if (oneRm > bestOneRm) bestOneRm = oneRm;
        }

        return com.example.Fitness.DTO.response.workout_logs.ExerciseProgressResponse.builder()
                .exerciseId(exerciseId)
                .exerciseName(exercise.getName())
                .points(points)
                .bestWeight(bestWeight)
                .bestReps(bestReps)
                .bestEstimatedOneRm(Math.round(bestOneRm * 10) / 10.0)
                .bestDate(bestDate)
                .build();
    }

    // ===== Feature: Nhật ký tập luyện (danh sách buổi tập đã log + chi tiết từng set) =====

    /** Danh sách buổi tập đã log trong khoảng ngày, gom nhóm theo (workoutDay, ngày thực tế). */
    public List<WorkoutSessionSummaryResponse> getSessions(LocalDate fromDate, LocalDate toDate) {
        User user = getCurrentUserOrThrow();
        LocalDateTime start = (fromDate != null) ? fromDate.atStartOfDay() : LocalDate.now(VN_ZONE).minusDays(30).atStartOfDay();
        LocalDateTime end = (toDate != null) ? toDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        List<WorkoutLogs> rawLogs = workoutLogRepository.searchLogs(user.getId(), start, end, null)
                .stream().filter(l -> l.getWorkoutDay() != null).collect(Collectors.toList());

        Map<String, List<WorkoutLogs>> sessions = rawLogs.stream()
                .collect(Collectors.groupingBy(l -> l.getWorkoutDay().getId() + "_" + l.getCreatedAt().toLocalDate()));

        List<WorkoutSessionSummaryResponse> result = new ArrayList<>();
        for (List<WorkoutLogs> logs : sessions.values()) {
            result.add(buildSessionSummary(user, logs));
        }
        result.sort((a, b) -> b.getDate().compareTo(a.getDate()));
        return result;
    }

    /** Chi tiết 1 buổi tập: từng bài + từng set (target vs thực tế/AI nhận diện). */
    public WorkoutSessionDetailResponse getSessionDetail(Long workoutDayId, LocalDate date) throws DataNotFoundException {
        User user = getCurrentUserOrThrow();
        WorkoutDay workoutDay = workoutDayRepository.findById(workoutDayId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy buổi tập"));

        List<WorkoutLogs> logs = workoutLogRepository.findByUserIdAndWorkoutDayId(user.getId(), workoutDayId)
                .stream().filter(l -> l.getCreatedAt().toLocalDate().isEqual(date)).collect(Collectors.toList());

        WorkoutSessionSummaryResponse summary = logs.isEmpty()
                ? buildEmptySessionSummary(workoutDay, date)
                : buildSessionSummary(user, logs);

        Map<Long, List<WorkoutLogs>> logsByExercise = logs.stream()
                .collect(Collectors.groupingBy(l -> l.getExercise().getId(), LinkedHashMap::new, Collectors.toList()));

        List<WorkoutSessionDetailResponse.ExerciseSessionDetail> exerciseDetails = new ArrayList<>();
        List<WorkoutDayExercises> plannedExercises = workoutDay.getWorkoutDayExercises() != null
                ? workoutDay.getWorkoutDayExercises() : List.of();

        for (WorkoutDayExercises planned : plannedExercises) {
            Long exId = planned.getExercises().getId();
            List<WorkoutLogs> exLogs = logsByExercise.getOrDefault(exId, List.of());
            int setsTarget = planned.getSets() != null ? planned.getSets() : 0;
            Integer repsPerSetTarget = planned.getReps();

            List<WorkoutSessionDetailResponse.SetDetail> setDetails = new ArrayList<>();
            for (WorkoutLogs log : exLogs) {
                boolean matches = repsPerSetTarget == null || (log.getActualReps() != null && log.getActualReps() >= repsPerSetTarget);
                String status = matches ? "MATCH" : (log.getPoseQuality() != null ? "AI_MISMATCH" : "MISMATCH");
                setDetails.add(WorkoutSessionDetailResponse.SetDetail.builder()
                        .setNumber(log.getSetNumber() != null ? log.getSetNumber() : setDetails.size() + 1)
                        .weight(log.getActualWeights())
                        .targetReps(repsPerSetTarget)
                        .actualReps(log.getActualReps())
                        .matchesTarget(matches)
                        .status(status)
                        .poseQuality(log.getPoseQuality())
                        .build());
            }

            double exCompletion = setsTarget > 0 ? round1((double) exLogs.size() / setsTarget * 100) : 0;
            exerciseDetails.add(WorkoutSessionDetailResponse.ExerciseSessionDetail.builder()
                    .exerciseId(exId)
                    .exerciseName(planned.getExercises().getName())
                    .thumbnail(planned.getExercises().getThumbnail())
                    .muscleGroupLabel(resolvePrimaryMuscleGroup(planned.getExercises()))
                    .setsCompleted(exLogs.size())
                    .setsTarget(setsTarget)
                    .repsPerSetTarget(repsPerSetTarget)
                    .completionPercent(exCompletion)
                    .sets(setDetails)
                    .build());
        }

        return WorkoutSessionDetailResponse.builder()
                .workoutDayId(summary.getWorkoutDayId())
                .date(summary.getDate())
                .sessionLabel(summary.getSessionLabel())
                .planName(summary.getPlanName())
                .startTime(summary.getStartTime())
                .durationMinutes(summary.getDurationMinutes())
                .setsCompleted(summary.getSetsCompleted())
                .setsTarget(summary.getSetsTarget())
                .repsCompleted(summary.getRepsCompleted())
                .repsTarget(summary.getRepsTarget())
                .volumeKg(summary.getVolumeKg())
                .completionPercent(summary.getCompletionPercent())
                .prExerciseName(summary.getPrExerciseName())
                .prWeightGain(summary.getPrWeightGain())
                .exercises(exerciseDetails)
                .build();
    }

    /** Buổi tập chưa có log nào (vd: ngày tương lai hoặc đã bỏ lỡ) — trả dữ liệu rỗng thay vì crash. */
    private WorkoutSessionSummaryResponse buildEmptySessionSummary(WorkoutDay workoutDay, LocalDate date) {
        List<WorkoutDayExercises> plannedExercises = workoutDay.getWorkoutDayExercises() != null
                ? workoutDay.getWorkoutDayExercises() : List.of();
        int setsTarget = plannedExercises.stream().mapToInt(e -> e.getSets() != null ? e.getSets() : 0).sum();
        int repsTarget = plannedExercises.stream()
                .mapToInt(e -> (e.getSets() != null ? e.getSets() : 0) * (e.getReps() != null ? e.getReps() : 0)).sum();

        return WorkoutSessionSummaryResponse.builder()
                .workoutDayId(workoutDay.getId())
                .date(date.toString())
                .sessionLabel("Buổi " + workoutDay.getDayInNumber())
                .planName(workoutDay.getWorkoutPlan() != null ? workoutDay.getWorkoutPlan().getName() : null)
                .startTime(null)
                .durationMinutes(0)
                .setsCompleted(0)
                .setsTarget(setsTarget)
                .repsCompleted(0)
                .repsTarget(repsTarget)
                .volumeKg(0)
                .completionPercent(0)
                .prExerciseName(null)
                .prWeightGain(null)
                .build();
    }

    private WorkoutSessionSummaryResponse buildSessionSummary(User user, List<WorkoutLogs> logs) {
        WorkoutLogs first = logs.get(0);
        WorkoutDay workoutDay = first.getWorkoutDay();
        LocalDate date = first.getCreatedAt().toLocalDate();

        LocalDateTime sessionStart = logs.stream().map(WorkoutLogs::getCreatedAt).min(LocalDateTime::compareTo).orElse(first.getCreatedAt());
        LocalDateTime sessionEnd = logs.stream().map(WorkoutLogs::getCreatedAt).max(LocalDateTime::compareTo).orElse(first.getCreatedAt());
        int durationMinutes = (int) Duration.between(sessionStart, sessionEnd).toMinutes();

        Map<Long, WorkoutDayExercises> plannedByExercise = (workoutDay.getWorkoutDayExercises() != null ? workoutDay.getWorkoutDayExercises() : List.<WorkoutDayExercises>of())
                .stream().collect(Collectors.toMap(e -> e.getExercises().getId(), e -> e, (a, b) -> a));

        int setsTarget = plannedByExercise.values().stream().mapToInt(e -> e.getSets() != null ? e.getSets() : 0).sum();
        int repsTarget = plannedByExercise.values().stream()
                .mapToInt(e -> (e.getSets() != null ? e.getSets() : 0) * (e.getReps() != null ? e.getReps() : 0)).sum();

        int setsCompleted = logs.size();
        int repsCompleted = logs.stream().mapToInt(l -> l.getActualReps() != null ? l.getActualReps() : 0).sum();
        double volumeKg = logs.stream()
                .mapToDouble(l -> (l.getActualReps() != null ? l.getActualReps() : 0) * (l.getActualWeights() != null ? l.getActualWeights() : 0))
                .sum();
        double completionPercent = setsTarget > 0 ? round1((double) setsCompleted / setsTarget * 100) : 0;

        // Phát hiện PR: với mỗi bài có log tạ trong buổi, so tạ nặng nhất buổi này với lịch sử trước buổi này
        String prExerciseName = null;
        Double prWeightGain = null;
        Map<Long, List<WorkoutLogs>> byExercise = logs.stream().collect(Collectors.groupingBy(l -> l.getExercise().getId()));
        LocalDateTime beforeSession = sessionStart;
        for (Map.Entry<Long, List<WorkoutLogs>> entry : byExercise.entrySet()) {
            double sessionMax = entry.getValue().stream()
                    .mapToDouble(l -> l.getActualWeights() != null ? l.getActualWeights() : 0).max().orElse(0);
            if (sessionMax <= 0) continue;
            Double historicalMax = workoutLogRepository.findMaxWeightBefore(user.getId(), entry.getKey(), beforeSession);
            if (historicalMax != null && sessionMax > historicalMax) {
                double gain = round1(sessionMax - historicalMax);
                if (prWeightGain == null || gain > prWeightGain) {
                    prWeightGain = gain;
                    prExerciseName = entry.getValue().get(0).getExercise().getName();
                }
            }
        }

        return WorkoutSessionSummaryResponse.builder()
                .workoutDayId(workoutDay.getId())
                .date(date.toString())
                .sessionLabel("Buổi " + workoutDay.getDayInNumber())
                .planName(workoutDay.getWorkoutPlan() != null ? workoutDay.getWorkoutPlan().getName() : null)
                .startTime(sessionStart.format(DateTimeFormatter.ofPattern("HH:mm")))
                .durationMinutes(Math.max(durationMinutes, 1))
                .setsCompleted(setsCompleted)
                .setsTarget(setsTarget)
                .repsCompleted(repsCompleted)
                .repsTarget(repsTarget)
                .volumeKg(round1(volumeKg))
                .completionPercent(completionPercent)
                .prExerciseName(prExerciseName)
                .prWeightGain(prWeightGain)
                .build();
    }

    private String resolvePrimaryMuscleGroup(Exercises exercise) {
        if (exercise.getExerciseMuscleGroups() == null) return null;
        return exercise.getExerciseMuscleGroups().stream()
                .filter(ExerciseMuscleGroup::isPrimary)
                .findFirst()
                .or(() -> exercise.getExerciseMuscleGroups().stream().findFirst())
                .map(g -> g.getMuscleGroup() != null ? g.getMuscleGroup().getName() : null)
                .orElse(null);
    }

    private double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }

    private User getCurrentUserOrThrow() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }
}
