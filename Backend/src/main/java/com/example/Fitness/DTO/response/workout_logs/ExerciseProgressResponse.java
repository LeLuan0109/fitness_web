package com.example.Fitness.DTO.response.workout_logs;

import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Dữ liệu theo dõi tiến bộ sức mạnh của MỘT bài tập theo thời gian + kỷ lục (PR).
 */
@Data
@Builder
public class ExerciseProgressResponse {
    private Long exerciseId;
    private String exerciseName;

    private List<ProgressPoint> points;   // chuỗi thời gian theo ngày

    // Kỷ lục cá nhân (Personal Record)
    private Double bestWeight;             // tạ nặng nhất từng nâng
    private Integer bestReps;             // reps nhiều nhất trong 1 set
    private Double bestEstimatedOneRm;    // 1RM ước tính cao nhất (Epley)
    private String bestDate;              // ngày lập kỷ lục (theo tạ nặng nhất)

    @Data
    @Builder
    public static class ProgressPoint {
        private String date;              // yyyy-MM-dd
        private Double maxWeight;         // tạ nặng nhất trong ngày
        private Integer maxReps;          // reps nhiều nhất trong ngày
        private Double estimatedOneRm;    // 1RM ước tính trong ngày
        private Double volume;            // tổng volume (reps × tạ) trong ngày
    }
}
