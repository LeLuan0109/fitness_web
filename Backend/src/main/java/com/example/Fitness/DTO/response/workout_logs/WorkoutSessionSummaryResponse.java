package com.example.Fitness.DTO.response.workout_logs;

import lombok.Builder;
import lombok.Data;

/**
 * Tóm tắt 1 buổi tập đã log (nhật ký tập luyện) — dùng cho danh sách lịch sử.
 */
@Data
@Builder
public class WorkoutSessionSummaryResponse {
    private Long workoutDayId;
    private String date;          // yyyy-MM-dd
    private String sessionLabel;  // "Buổi 3" ...
    private String planName;
    private String startTime;     // HH:mm
    private int durationMinutes;
    private int setsCompleted;
    private int setsTarget;
    private int repsCompleted;
    private int repsTarget;
    private double volumeKg;
    private double completionPercent;
    private String prExerciseName; // null nếu buổi này không có PR nào
    private Double prWeightGain;
}
