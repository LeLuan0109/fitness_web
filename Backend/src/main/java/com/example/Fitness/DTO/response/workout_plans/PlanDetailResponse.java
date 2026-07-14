package com.example.Fitness.DTO.response.workout_plans;

import com.example.Fitness.Enum.DifficultyLevel;
import com.example.Fitness.Enum.FitnessGoal;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanDetailResponse {
    private Long id;
    private String name;
    private String description;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate startDate;

    private Integer durationWeek; // Tổng số tuần (để hiện box Duration)
    private Integer daysPerWeek;  // Số buổi/tuần (để hiện box Day/week)
    private Long totalUsers;      // Số người đang tập (để hiện box Users)

    private FitnessGoal targetGoal;
    private DifficultyLevel difficultyLevel;
    private Boolean isDefault;

    private List<PlanWeekResponse> weeks;
}
