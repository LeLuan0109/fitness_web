package com.example.Fitness.DTO.response;

import lombok.*;
import java.util.List;

@Data
@Builder
public class ExerciseResponse {
    private Long id;
    private String name;
    private String level;
    private String aiExerciseKey; // Key nhận diện AI camera (VD "SQUAT"); null = chưa hỗ trợ đếm AI
    private String thumbnail;
    private String videoUrl;
    private String description;
    private String benefit;
    private String trainingType; // Tên loại hình (VD: Strength)
    private List<String> equipments;

    private List<String> primaryMuscles;   // Cơ chính
    private List<String> secondaryMuscles; //Cơ phụ

    private List<String> steps;     // Các bước tập
    private List<String> tips;      // Mẹo
    private List<String> mistakes;  // Sai lầm thường gặp
    private List<String> benefits;
}