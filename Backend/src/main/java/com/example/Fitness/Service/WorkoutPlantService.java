package com.example.Fitness.Service;

import com.example.Fitness.DTO.request.CreatePlanRequest;
import com.example.Fitness.DTO.request.PlanDayRequest;
import com.example.Fitness.DTO.request.PlanExerciseRequest;
import com.example.Fitness.DTO.request.PlanSearchRequest;
import com.example.Fitness.DTO.response.ExerciseResponse;
import com.example.Fitness.DTO.response.workout_plans.*;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Mapper.WorkoutDayMapper;
import com.example.Fitness.Mapper.WorkoutLogMapper;
import com.example.Fitness.Mapper.WorkoutPlanMapper;
import com.example.Fitness.Model.*;
import com.example.Fitness.Repository.*;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WorkoutPlantService {
    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final WorkoutDayRepository workoutDayRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutDayExerciseRepository workoutDayExerciseRepository;
    private final WorkoutLogRepository workoutLogRepository;

    private final WorkoutPlanMapper workoutPlanMapper;
    private final WorkoutDayMapper workoutDayMapper;
    private final WorkoutLogMapper workoutLogMapper;

    private final PlanLabelSuggestionService planLabelSuggestionService;

    public WorkoutPlan createWorkoutPlan(CreatePlanRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        WorkoutPlan workoutPlan = workoutPlanMapper.toWorkoutPlan(request);
        workoutPlan.setUser(user);
        workoutPlan.setIsDefault(user.getRole().getName().equalsIgnoreCase("ADMIN"));
        workoutPlan.setIsActive(true);

        // GÁN NHÃN = code đề xuất + người chốt:
        // Nếu người tạo KHÔNG chọn độ khó (override) → hệ thống tự suy từ nội dung bài tập.
        // Nếu có chọn → tôn trọng lựa chọn của người tạo (admin/user).
        if (workoutPlan.getDifficultyLevel() == null && request.getSchedule() != null) {
            var suggestion = planLabelSuggestionService.suggest(request.getSchedule());
            workoutPlan.setDifficultyLevel(suggestion.getSuggestedDifficulty());
            if (workoutPlan.getDaysPerWeek() == null) {
                workoutPlan.setDaysPerWeek(suggestion.getDaysPerWeek());
            }
        }

        WorkoutPlan savedPlan = workoutPlanRepository.save(workoutPlan);
        System.out.println(workoutPlan.getStartDate());
        System.out.println(savedPlan.getStartDate());
        createScheduleForPlan(savedPlan, request.getSchedule());
        return savedPlan;
    }

    public Page<PlanResponse> getSamplePlans(PlanSearchRequest request) {
        Specification<WorkoutPlan> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isFalse(root.get("isDeleted")));
            predicates.add(cb.isTrue(root.get("isDefault")));

            if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
                predicates.add(cb.like(root.get("name"), "%" + request.getKeyword() + "%"));
            }
            if (request.getGoal() != null) {
                predicates.add(cb.equal(root.get("targetGoal"), request.getGoal()));
            }
            if (request.getLevel() != null) {
                predicates.add(cb.equal(root.get("difficultyLevel"), request.getLevel()));
            }
            if (request.getDuration() != null) {
                predicates.add(cb.equal(root.get("durationWeek"), request.getDuration()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Pageable pageable = Pageable.ofSize(request.getLimit()).withPage(request.getPage());
        return workoutPlanRepository.findAll(spec, pageable)
                .map(workoutPlanMapper::toPlanResponse);
    }

    public Page<PlanResponse> getMyPlans(PlanSearchRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Specification<WorkoutPlan> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.isFalse(root.get("isDeleted")));
            predicates.add(cb.isFalse(root.get("isDefault")));
            predicates.add(cb.equal(root.get("user").get("id"), currentUser.getId()));

            if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
                predicates.add(cb.like(root.get("name"), "%" + request.getKeyword() + "%"));
            }
            if (request.getGoal() != null) {
                predicates.add(cb.equal(root.get("targetGoal"), request.getGoal()));
            }
            if (request.getLevel() != null) {
                predicates.add(cb.equal(root.get("difficultyLevel"), request.getLevel()));
            }
            if (request.getDuration() != null) {
                predicates.add(cb.equal(root.get("durationWeek"), request.getDuration()));
            }if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
                predicates.add(cb.like(root.get("name"), "%" + request.getKeyword() + "%"));
            }
            if (request.getGoal() != null) {
                predicates.add(cb.equal(root.get("targetGoal"), request.getGoal()));
            }
            if (request.getLevel() != null) {
                predicates.add(cb.equal(root.get("difficultyLevel"), request.getLevel()));
            }
            if (request.getDuration() != null) {
                predicates.add(cb.equal(root.get("durationWeek"), request.getDuration()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
        Pageable pageable = Pageable.ofSize(request.getLimit()).withPage(request.getPage());
        return workoutPlanRepository.findAll(spec, pageable).map(workoutPlanMapper::toPlanResponse);
    }

        public PlanDetailResponse getPlanDetail(Long planId) {
            // 1. Lấy Plan
            WorkoutPlan plan = workoutPlanRepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch tập ID: " + planId));

            // 2. Lấy User hiện tại để tìm logs
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // 3. Lấy danh sách ngày (Structure)
            List<WorkoutDay> workoutDays = workoutDayRepository.findByWorkoutPlanIdAndIsDeletedFalseOrderByWeekNumberAscDayInNumberAsc(planId);
            log.info(workoutDays.toString());
            // 4. --- LẤY LOGS ---
            // Lấy tất cả logs của user trong plan này (1 query duy nhất)
            LocalDate dateToView = LocalDate.now();

            LocalDateTime startOfDay = dateToView.atStartOfDay();
            LocalDateTime endOfDay = dateToView.atTime(LocalTime.MAX);
            List<WorkoutLogs> allLogsInPlan = workoutLogRepository.findAllByUserIdAndPlanIdAndDate(currentUser.getId(),
                    planId,
                    startOfDay,
                    endOfDay);

            // Gom nhóm Logs theo WorkoutDay ID để dễ truy xuất
            Map<Long, List<WorkoutLogs>> logsByDayMap = allLogsInPlan.stream()
                    .collect(Collectors.groupingBy(log -> log.getWorkoutDay().getId()));
            // 5. Xử lý gom nhóm tuần và map dữ liệu
            Map<Integer, List<WorkoutDay>> daysByWeek = workoutDays.stream()
                    .collect(Collectors.groupingBy(WorkoutDay::getWeekNumber));

            List<PlanWeekResponse> weeksResponse = new ArrayList<>();

            daysByWeek.keySet().stream().sorted().forEach(weekNum -> {
                List<WorkoutDay> daysInWeek = daysByWeek.get(weekNum);

                List<PlanDayResponse> daysResponse = daysInWeek.stream()
                        .map(day -> {
                            // A. Map thông tin cơ bản của Day
                            PlanDayResponse dayResponse = workoutDayMapper.toPlanDayResponse(day);

                            // B. Xử lý gán Logs vào từng bài tập trong ngày
                            if (dayResponse.getExercises() != null) {
                                // Lấy danh sách log thuộc ngày này
                                List<WorkoutLogs> dayLogs = logsByDayMap.getOrDefault(day.getId(), new ArrayList<>());

                                // Gom nhóm log theo Exercise ID
                                Map<Long, List<WorkoutLogs>> logsByExerciseMap = dayLogs.stream()
                                        .collect(Collectors.groupingBy(log -> log.getExercise().getId()));

                                // Duyệt qua từng bài tập trong response và gán logs
                                dayResponse.getExercises().forEach(exResponse -> {
                                    List<WorkoutLogs> matchedLogs = logsByExerciseMap.getOrDefault(exResponse.getExerciseId(), new ArrayList<>());
                                    System.out.println("Logs "+ matchedLogs);
                                    // Map Entity Log -> DTO Log
                                    exResponse.setLogs(workoutLogMapper.toWorkoutLogResponseList(matchedLogs));
                                });
                            }
                            return dayResponse;
                        })
                        .collect(Collectors.toList());

                weeksResponse.add(PlanWeekResponse.builder()
                        .weekNumber(weekNum)
                        .days(daysResponse)
                        .build());
            });

            // 6. Build response cuối cùng
            PlanDetailResponse response = workoutPlanMapper.toPlanDetailResponse(plan);
            response.setWeeks(weeksResponse);

            return response;
        }

    public PlanDetailResponse updatePlan(Long planId, CreatePlanRequest request) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch tập"));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng"));

        boolean isAdmin = currentUser.getRole().getName().equalsIgnoreCase("ADMIN");
        boolean isOwner = plan.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Bạn không có quyền sửa lịch tập này");
        }
        if (plan.getStartDate() != null && plan.getStartDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Không thể chỉnh sửa lịch tập đã bắt đầu diễn ra.");
        }
        workoutPlanMapper.updateWorkoutPlanFromRequest(request, plan);
        WorkoutPlan savedPlan = workoutPlanRepository.save(plan);
        if (request.getSchedule() != null) {
            List<WorkoutDay> oldDays = workoutDayRepository.findByWorkoutPlanIdAndIsDeletedFalseOrderByWeekNumberAscDayInNumberAsc(planId);

            for (WorkoutDay day : oldDays) {
                day.setDeleted(true);
            }
            workoutDayRepository.saveAll(oldDays);

            createScheduleForPlan(savedPlan, request.getSchedule());
        }

        return getPlanDetail(planId);
    }

    public void deletePlan(Long planId) {
        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch tập"));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng"));

        boolean isAdmin = currentUser.getRole().getName().equalsIgnoreCase("ADMIN");
        boolean isOwner = plan.getUser().getId().equals(currentUser.getId());

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Bạn không có quyền xóa lịch tập này");
        }

        plan.setDeleted(true);
        workoutPlanRepository.save(plan);
    }

    public List<PlanResponse> getOutstandingPlans() {
        Pageable limit = PageRequest.of(0, 3);
        List<WorkoutPlan> plans = workoutPlanRepository.findOutstandingPlans(limit);

        return plans.stream()
                .map(workoutPlanMapper::toPlanResponse)
                .collect(Collectors.toList());
    }

    public Long copyPlan(Long sourcePlanId) {
        // 1. Lấy User hiện tại
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 2. Lấy Plan gốc
        WorkoutPlan sourcePlan = workoutPlanRepository.findById(sourcePlanId)
                .orElseThrow(() -> new RuntimeException("Lịch tập không tồn tại"));

        // 3. Clone thông tin cơ bản
        WorkoutPlan newPlan = new WorkoutPlan();
        newPlan.setName(sourcePlan.getName() + " (Copy)");
        newPlan.setDescription(sourcePlan.getDescription());
        newPlan.setTargetGoal(sourcePlan.getTargetGoal());
        newPlan.setDifficultyLevel(sourcePlan.getDifficultyLevel());
        newPlan.setDurationWeek(sourcePlan.getDurationWeek());
        newPlan.setDaysPerWeek(sourcePlan.getDaysPerWeek());
        newPlan.setStartDate(LocalDate.now().plusDays(1));

        newPlan.setUser(currentUser);
        newPlan.setIsDefault(false);
        newPlan.setDeleted(false);
        newPlan.setIsActive(true);

        WorkoutPlan savedNewPlan = workoutPlanRepository.save(newPlan);

        // 4. Clone chi tiết
        // Lấy danh sách ngày của plan gốc
        List<WorkoutDay> sourceDays = workoutDayRepository.findByWorkoutPlanIdAndIsDeletedFalseOrderByWeekNumberAscDayInNumberAsc(sourcePlanId);

        for (WorkoutDay sourceDay : sourceDays) {
            // A. Clone Ngày
            WorkoutDay newDay = new WorkoutDay();
            newDay.setWorkoutPlan(savedNewPlan);
            newDay.setDayOfWeek(sourceDay.getDayOfWeek());
            newDay.setWeekNumber(sourceDay.getWeekNumber());
            newDay.setDayInNumber(sourceDay.getDayInNumber());

            WorkoutDay savedNewDay = workoutDayRepository.save(newDay);

            if (sourceDay.getWorkoutDayExercises() != null) {
                for (WorkoutDayExercises sourceEx : sourceDay.getWorkoutDayExercises()) {
                    WorkoutDayExercises newEx = new WorkoutDayExercises();
                    newEx.setWorkoutDay(savedNewDay);
                    newEx.setExercises(sourceEx.getExercises());

                    newEx.setSets(sourceEx.getSets());
                    newEx.setReps(sourceEx.getReps());
                    newEx.setWeight(sourceEx.getWeight());
                    newEx.setDuration(sourceEx.getDuration());

                    workoutDayExerciseRepository.save(newEx);
                }
            }
        }

        return savedNewPlan.getId();
    }

    /** Bật/tắt trạng thái "đang hoạt động" của 1 kế hoạch cá nhân — chỉ chủ sở hữu mới được đổi, không áp dụng cho kế hoạch mẫu. */
    public void setPlanActive(Long planId, boolean active) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        WorkoutPlan plan = workoutPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch"));

        if (plan.getIsDefault() != null && plan.getIsDefault()) {
            throw new RuntimeException("Kế hoạch mẫu không có trạng thái hoạt động");
        }
        if (plan.getUser() == null || !plan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền thay đổi kế hoạch này");
        }

        plan.setIsActive(active);
        workoutPlanRepository.save(plan);
    }

    private void createScheduleForPlan(WorkoutPlan plan, List<PlanDayRequest> schedule) {
        if (schedule == null || schedule.isEmpty()) return;

        for (PlanDayRequest dayReq : schedule) {
            WorkoutDay workoutDay = WorkoutDay.builder()
                    .workoutPlan(plan)
                    .weekNumber(dayReq.getWeekNumber())
                    .dayOfWeek(dayReq.getDayOfWeek())
                    .build();
            WorkoutDay savedDay = workoutDayRepository.save(workoutDay);

            if (dayReq.getExercises() != null) {
                for (PlanExerciseRequest exReq : dayReq.getExercises()) {
                    Exercises exercise = exerciseRepository.findById(exReq.getExerciseId())
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập với ID: " + exReq.getExerciseId()));

                    WorkoutDayExercises dayExercise = WorkoutDayExercises.builder()
                            .workoutDay(savedDay)
                            .exercises(exercise)
                            .sets(exReq.getSets())
                            .reps(exReq.getReps())
                            .duration(exReq.getDuration())
                            .weight(exReq.getWeight())
                            .build();
                    workoutDayExerciseRepository.save(dayExercise);
                }
            }
        }
    }


    public List<PlanResponse> getPlansBySpecificDate(LocalDate targetDate) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        int targetDayOfWeek = targetDate.getDayOfWeek().getValue();

        List<WorkoutPlan> candidates = workoutPlanRepository.findActivePlansByDate(currentUser.getId(), targetDayOfWeek, targetDate);

        List<PlanResponse> results = new ArrayList<>();

        for (WorkoutPlan plan : candidates) {
            if (plan.getDurationWeek() != null && plan.getDurationWeek() > 0) {
                LocalDate endDate = plan.getStartDate().plusWeeks(plan.getDurationWeek()).minusDays(1);
                if (targetDate.isAfter(endDate)) continue;
            }

            // B. TÍNH TOÁN TUẦN HIỆN TẠI (Quan trọng)
            // Ví dụ: Start = 01/01, Target = 08/01 -> Cách nhau 7 ngày -> Là tuần 2.
            // ChronoUnit.WEEKS.between trả về số tuần trọn vẹn đã trôi qua.
            // +1 để ra số thứ tự tuần (Tuần 1, Tuần 2...)
            long weeksPassed = java.time.temporal.ChronoUnit.WEEKS.between(plan.getStartDate(), targetDate);
            int currentWeekNumber = (int) weeksPassed + 1;

            // C. Tìm WorkoutDay khớp với Thứ và Tuần
            // Lưu ý: plan.getWorkoutDays() cần fetch (không được Lazy exception)
            // Nếu đang để Lazy, bạn cần viết query fetch join hoặc cấu hình @Transactional cho hàm service này
            Optional<WorkoutDay> matchingDay = plan.getWorkoutDays().stream()
                    .filter(d -> d.getDayOfWeek() == targetDayOfWeek
                            && d.getWeekNumber() == currentWeekNumber
                            && !d.isDeleted())
                    .findFirst();

            // D. Map sang DTO
            if (matchingDay.isPresent()) {
                PlanResponse response = workoutPlanMapper.toPlanResponse(plan);
                // Gán ID ngày tập vào DTO
                response.setCurrentWorkoutDayId(matchingDay.get().getId());
                results.add(response);
            }
        }

        return results;
    }

    @Transactional()
    public WorkoutDayDetailResponse getExercisesByDayId(Long dayId) {
        // 1. Tìm và kiểm tra ngày tập
        WorkoutDay workoutDay = workoutDayRepository.findById(dayId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ngày tập với ID: " + dayId));

        if (workoutDay.isDeleted()) {
            throw new RuntimeException("Ngày tập này không tồn tại hoặc đã bị xóa");
        }

        // 2. Map danh sách bài tập (Sử dụng hàm helper)
        List<WorkoutDayExerciseResponse> dayExerciseResponses = workoutDay.getWorkoutDayExercises().stream()
                .map(this::mapToDayExerciseResponse)
                .toList();

        // 3. Trả về kết quả tổng hợp
        return WorkoutDayDetailResponse.builder()
                .dayId(workoutDay.getId())
                .weekNumber(workoutDay.getWeekNumber())
                .dayOfWeek(workoutDay.getDayOfWeek())
                .dayInNumber(workoutDay.getDayInNumber())
                .exercises(dayExerciseResponses)
                .build();
    }

    private WorkoutDayExerciseResponse mapToDayExerciseResponse(WorkoutDayExercises wde) {
        Exercises ex = wde.getExercises();

        List<String> primaryMuscles = ex.getExerciseMuscleGroups() != null
                ? ex.getExerciseMuscleGroups().stream()
                .filter(ExerciseMuscleGroup::isPrimary)
                .map(emg -> emg.getMuscleGroup().getName())
                .toList()
                : new ArrayList<>();

        List<String> secondaryMuscles = ex.getExerciseMuscleGroups() != null
                ? ex.getExerciseMuscleGroups().stream()
                .filter(emg -> !emg.isPrimary())
                .map(emg -> emg.getMuscleGroup().getName())
                .toList()
                : new ArrayList<>();

        // B. Tạo ExerciseResponse (Chi tiết bài tập)
        ExerciseResponse exerciseInfo = ExerciseResponse.builder()
                .id(ex.getId())
                .name(ex.getName())
                .description(ex.getDescription())
                .level(ex.getLevel())
                .aiExerciseKey(ex.getAiExerciseKey())
                .thumbnail(ex.getThumbnail())
                .videoUrl(ex.getVideoUrl())
                .trainingType(ex.getTrainingType() != null ? ex.getTrainingType().getName() : null)

                .equipments(ex.getEquipments().stream()
                        .map(Equipment::getName)
                        .toList())

                .primaryMuscles(primaryMuscles)
                .secondaryMuscles(secondaryMuscles)

                .steps(ex.getSteps().stream()
                        .map(ExerciseStep::getInstruction)
                        .toList())

                .tips(ex.getTips().stream()
                        .map(ExerciseTip::getContent)
                        .toList())

                .mistakes(ex.getMistakes().stream()
                        .map(ExerciseMistake::getContent)
                        .toList())

                .benefits(ex.getBenefits().stream()
                        .map(ExerciseBenefit::getContent)
                        .toList())
                .build();

        return WorkoutDayExerciseResponse.builder()
                .id(wde.getId())        // ID bảng trung gian (để tracking)
                .sets(wde.getSets())
                .reps(wde.getReps())
                .weight(wde.getWeight())
                .duration(wde.getDuration())
                .exercise(exerciseInfo) // <--- Object lồng nhau
                .build();
    }
}
