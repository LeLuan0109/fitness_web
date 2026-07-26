package com.example.Fitness.DTO.response.workout_logs;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Chi tiết 1 buổi tập: danh sách bài tập + từng set (target vs thực tế/AI nhận diện).
 * setStatus mỗi set: MATCH (đạt target) | MISMATCH (không đạt, ghi tay) | AI_MISMATCH (không đạt, do camera AI đếm)
 */
@Data
@Builder
public class WorkoutSessionDetailResponse {
    private Long workoutDayId;
    private String date;
    private String sessionLabel;
    private String planName;
    private String startTime;
    private int durationMinutes;
    private int setsCompleted;
    private int setsTarget;
    private int repsCompleted;
    private int repsTarget;
    private double volumeKg;
    private double completionPercent;
    private String prExerciseName;
    private Double prWeightGain;

    private List<ExerciseSessionDetail> exercises;

    @Data
    @Builder
    public static class ExerciseSessionDetail {
        private Long exerciseId;
        private String exerciseName;
        private String thumbnail;
        private String muscleGroupLabel;
        private int setsCompleted;
        private int setsTarget;
        private Integer repsPerSetTarget;
        private double completionPercent;
        private List<SetDetail> sets;
    }

    @Data
    @Builder
    public static class SetDetail {
        private int setNumber;
        private Double weight;
        private Integer targetReps;
        private Integer actualReps;
        private boolean matchesTarget;
        private String status; // MATCH | MISMATCH | AI_MISMATCH
        private String poseQuality;
    }
}
