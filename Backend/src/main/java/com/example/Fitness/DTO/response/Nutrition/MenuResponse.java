package com.example.Fitness.DTO.response.Nutrition;

import com.example.Fitness.Enum.FitnessGoal;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponse {
    private Long id;
    private Integer displayOrder;
    private String name;
    private String description;
    private FitnessGoal fitnessGoal;
    private Integer caloriesTarget;

    private Boolean isDefault;
    private Long creatorId;
    private String creatorName;
    private String creatorAvatar;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private Float calories;
    private Float protein;
    private Float carbs;
    private Float fat;

    private List<MealResponse> meals;
}