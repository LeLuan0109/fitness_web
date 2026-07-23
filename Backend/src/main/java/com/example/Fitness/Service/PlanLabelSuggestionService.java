package com.example.Fitness.Service;

import com.example.Fitness.DTO.request.PlanDayRequest;
import com.example.Fitness.DTO.request.PlanExerciseRequest;
import com.example.Fitness.DTO.response.workout_plans.PlanLabelSuggestionResponse;
import com.example.Fitness.Enum.DifficultyLevel;
import com.example.Fitness.Model.Equipment;
import com.example.Fitness.Model.ExerciseMuscleGroup;
import com.example.Fitness.Model.Exercises;
import com.example.Fitness.Repository.ExerciseRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * ĐỀ XUẤT nhãn cho kế hoạch tập bằng cách phân tích các bài bên trong.
 *
 * Độ khó được suy bằng "bỏ phiếu theo ngưỡng CÓ NGUỒN" (không dùng trọng số tùy tiện):
 *  - Tần suất/tuần        — ACSM (2009): Mới 2-3 · TB 3-4 · Cao 4-6
 *  - Khoảng rep (proxy %1RM) — NSCA: 13+ rep(<67%) mới · 8-12(67-80%) TB · 1-7(80-100%) cao
 *  - Volume set/nhóm cơ/tuần — Schoenfeld 2017: <10 mới · 10-20 TB · >20 cao
 *  - Độ phức tạp kỹ thuật   — phân loại từ level của bài tập
 *
 * Nhãn cuối = bậc được >= 2/4 tín hiệu đồng thuận; hòa -> lấy bậc CAO HƠN cho an toàn.
 * Đây chỉ là ĐỀ XUẤT — người tạo có thể override.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PlanLabelSuggestionService {

    private final ExerciseRepository exerciseRepository;

    public PlanLabelSuggestionResponse suggest(List<PlanDayRequest> schedule) {
        List<String> reasoning = new ArrayList<>();

        if (schedule == null || schedule.isEmpty()) {
            return PlanLabelSuggestionResponse.builder()
                    .suggestedDifficulty(DifficultyLevel.BEGINNER)
                    .daysPerWeek(0)
                    .estimatedDurationMinutes(0)
                    .requiredEquipment(List.of())
                    .muscleGroups(List.of())
                    .difficultyReasoning(List.of("Không có bài tập để phân tích."))
                    .build();
        }

        // Nạp toàn bộ bài tập được tham chiếu (1 truy vấn).
        Set<Long> exerciseIds = schedule.stream()
                .filter(d -> d.getExercises() != null)
                .flatMap(d -> d.getExercises().stream())
                .map(PlanExerciseRequest::getExerciseId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<Long, Exercises> exMap = exerciseRepository.findAllById(exerciseIds).stream()
                .collect(Collectors.toMap(Exercises::getId, e -> e));

        // ---- Số buổi/tuần = số ngày (dayOfWeek) khác nhau ----
        Set<Integer> distinctDays = schedule.stream()
                .map(PlanDayRequest::getDayOfWeek).filter(Objects::nonNull).collect(Collectors.toSet());
        int daysPerWeek = distinctDays.isEmpty() ? schedule.size() : distinctDays.size();

        // ---- Gom số liệu qua các bài ----
        double repSum = 0; int repCount = 0;                 // cho tín hiệu cường độ
        int levelSum = 0; int levelCount = 0;                 // cho tín hiệu độ phức tạp
        int totalDurationSec = 0; int durationSlots = 0;
        Map<String, Integer> setsPerMuscle = new HashMap<>(); // cho tín hiệu volume
        Set<String> equipment = new LinkedHashSet<>();
        Set<String> muscles = new LinkedHashSet<>();

        for (PlanDayRequest day : schedule) {
            if (day.getExercises() == null) continue;
            for (PlanExerciseRequest pe : day.getExercises()) {
                Exercises ex = exMap.get(pe.getExerciseId());
                int sets = pe.getSets() != null ? pe.getSets() : 3;

                if (pe.getReps() != null && pe.getReps() > 0) {
                    repSum += pe.getReps() * sets;
                    repCount += sets;
                }
                if (pe.getDuration() != null && pe.getDuration() > 0) {
                    totalDurationSec += pe.getDuration() * sets;
                } else {
                    totalDurationSec += sets * 45; // ước lượng ~45s/set nếu không khai
                }
                totalDurationSec += Math.max(0, sets - 1) * 60; // nghỉ ~60s giữa set
                durationSlots++;

                if (ex == null) continue;

                DifficultyLevel lvl = parseLevel(ex.getLevel());
                if (lvl != null) { levelSum += ordinal(lvl); levelCount++; }

                if (ex.getEquipments() != null)
                    for (Equipment eq : ex.getEquipments()) if (eq.getName() != null) equipment.add(eq.getName());

                if (ex.getExerciseMuscleGroups() != null)
                    for (ExerciseMuscleGroup emg : ex.getExerciseMuscleGroups()) {
                        if (emg.getMuscleGroup() == null || emg.getMuscleGroup().getName() == null) continue;
                        String mg = emg.getMuscleGroup().getName();
                        if (emg.isPrimary()) {
                            muscles.add(mg);
                            setsPerMuscle.merge(mg, sets, Integer::sum);
                        }
                    }
            }
        }

        // ---- Bỏ phiếu 4 tín hiệu ----
        List<DifficultyLevel> votes = new ArrayList<>();

        // ① Tần suất (ACSM)
        DifficultyLevel freqVote = daysPerWeek <= 3 ? DifficultyLevel.BEGINNER
                : daysPerWeek == 4 ? DifficultyLevel.INTERMEDIATE : DifficultyLevel.ADVANCED;
        votes.add(freqVote);
        reasoning.add("Tần suất " + daysPerWeek + " buổi/tuần → " + viLabel(freqVote) + " (ACSM)");

        // ② Cường độ theo rep (NSCA)
        if (repCount > 0) {
            double avgReps = repSum / repCount;
            DifficultyLevel repVote = avgReps >= 13 ? DifficultyLevel.BEGINNER
                    : avgReps >= 8 ? DifficultyLevel.INTERMEDIATE : DifficultyLevel.ADVANCED;
            votes.add(repVote);
            reasoning.add(String.format("Rep trung bình %.0f → %s (NSCA)", avgReps, viLabel(repVote)));
        } else {
            reasoning.add("Không đủ dữ liệu rep → bỏ qua tín hiệu cường độ");
        }

        // ③ Volume set/nhóm cơ/tuần (Schoenfeld 2017) — dùng nhóm cơ có volume cao nhất
        int maxSetsPerMuscle = setsPerMuscle.values().stream().max(Integer::compareTo).orElse(0);
        if (maxSetsPerMuscle > 0) {
            DifficultyLevel volVote = maxSetsPerMuscle < 10 ? DifficultyLevel.BEGINNER
                    : maxSetsPerMuscle <= 20 ? DifficultyLevel.INTERMEDIATE : DifficultyLevel.ADVANCED;
            votes.add(volVote);
            reasoning.add(maxSetsPerMuscle + " set/nhóm cơ/tuần → " + viLabel(volVote) + " (Schoenfeld 2017)");
        }

        // ④ Độ phức tạp kỹ thuật (từ level bài tập)
        if (levelCount > 0) {
            double avgLvl = (double) levelSum / levelCount;
            DifficultyLevel cplxVote = avgLvl < 1.7 ? DifficultyLevel.BEGINNER
                    : avgLvl <= 2.3 ? DifficultyLevel.INTERMEDIATE : DifficultyLevel.ADVANCED;
            votes.add(cplxVote);
            reasoning.add("Độ phức tạp bài tập → " + viLabel(cplxVote) + " (NSCA)");
        }

        DifficultyLevel finalDifficulty = majorityVote(votes);
        reasoning.add("→ Kết luận: " + viLabel(finalDifficulty) + " (bậc ≥2/4 tín hiệu đồng thuận, hòa lấy bậc cao hơn)");

        int estMinutes = durationSlots > 0
                ? (int) Math.round((double) totalDurationSec / Math.max(1, daysPerWeek) / 60.0)
                : 0;

        return PlanLabelSuggestionResponse.builder()
                .suggestedDifficulty(finalDifficulty)
                .daysPerWeek(daysPerWeek)
                .estimatedDurationMinutes(estMinutes)
                .requiredEquipment(new ArrayList<>(equipment))
                .muscleGroups(new ArrayList<>(muscles))
                .difficultyReasoning(reasoning)
                .build();
    }

    /** Tiện ích: chỉ lấy nhãn độ khó (dùng khi tạo plan mà người dùng không chọn tay). */
    public DifficultyLevel suggestDifficulty(List<PlanDayRequest> schedule) {
        return suggest(schedule).getSuggestedDifficulty();
    }

    // ===== Helpers =====

    private DifficultyLevel majorityVote(List<DifficultyLevel> votes) {
        if (votes.isEmpty()) return DifficultyLevel.BEGINNER;
        Map<DifficultyLevel, Long> tally = votes.stream()
                .collect(Collectors.groupingBy(v -> v, Collectors.counting()));
        long max = tally.values().stream().max(Long::compareTo).orElse(0L);
        // Hòa → lấy bậc cao nhất trong số các bậc cùng số phiếu tối đa (an toàn hơn).
        return tally.entrySet().stream()
                .filter(e -> e.getValue() == max)
                .map(Map.Entry::getKey)
                .max(Comparator.comparingInt(this::ordinal))
                .orElse(DifficultyLevel.BEGINNER);
    }

    private int ordinal(DifficultyLevel d) {
        return switch (d) { case BEGINNER -> 1; case INTERMEDIATE -> 2; case ADVANCED -> 3; };
    }

    private String viLabel(DifficultyLevel d) {
        return switch (d) { case BEGINNER -> "Người mới"; case INTERMEDIATE -> "Trung bình"; case ADVANCED -> "Nâng cao"; };
    }

    /** Nhận diện độ khó bài tập từ chuỗi level tự do. */
    private DifficultyLevel parseLevel(String level) {
        if (level == null) return null;
        String s = level.trim().toUpperCase();
        if (s.contains("ADVANCE") || s.contains("NÂNG CAO") || s.contains("NANG CAO") || s.contains("HARD")) return DifficultyLevel.ADVANCED;
        if (s.contains("INTER") || s.contains("TRUNG BÌNH") || s.contains("TRUNG BINH") || s.contains("MEDIUM")) return DifficultyLevel.INTERMEDIATE;
        if (s.contains("BEGIN") || s.contains("NGƯỜI MỚI") || s.contains("NGUOI MOI") || s.contains("EASY") || s.contains("CƠ BẢN") || s.contains("CO BAN")) return DifficultyLevel.BEGINNER;
        return null;
    }
}
