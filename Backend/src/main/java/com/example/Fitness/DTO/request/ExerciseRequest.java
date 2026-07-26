package com.example.Fitness.DTO.request;

import jakarta.annotation.Nullable;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseRequest {
    private String name;
    private String level;
    private String aiExerciseKey; // Key nhận diện AI camera (VD "SQUAT"); để trống nếu chưa hỗ trợ
    private String description;
    private Long trainingTypeId;
    private Double met;
    private List<Long> muscleGroupIds;

    private MultipartFile thumbnail;
    private MultipartFile video;

    private List<Long> equipmentIds;

    private List<Long> primaryMuscleGroupIds;
    private List<Long> secondaryMuscleGroupIds;

    private List<String> steps;
    private List<String> tips;
    private List<String> mistakes;
    private List<String> benefits;
}