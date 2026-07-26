package com.example.Fitness.DTO.response.workout_plans;

import com.example.Fitness.Enum.DifficultyLevel;
import com.example.Fitness.Enum.FitnessGoal;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanResponse {
    private Long id;
    private String name;
    private String description;
    private Integer durationWeek;
    private Integer daysPerWeek;
    private FitnessGoal targetGoal;
    private DifficultyLevel difficultyLevel;
    private Boolean isDefault;
    private Boolean isActive;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate startDate;
    private Long currentWorkoutDayId;   //ID của ngày tập cụ thể
}
