package com.example.Fitness.DTO.request;

import com.example.Fitness.Enum.DifficultyLevel;
import com.example.Fitness.Enum.FitnessGoal;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePlanRequest {
    @NotBlank(message = "Tên lịch tập không được để trống")
    private String name;

    @NotNull(message = "Mục tiêu không được để trống")
    private FitnessGoal goal;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    private LocalDate startDate;

    @Min(value = 1, message = "Thời lượng phải ít nhất 1 tuần")
    private Integer durationWeek;

    @NotNull(message = "Số ngày tập luyên trong 1 tuần không được để trống")
    private Integer daysPerWeek;

    private DifficultyLevel level;

    private String description;

    @NotEmpty(message = "Lịch tập chi tiết không được để trống")
    @Valid
    private List<PlanDayRequest> schedule;
}
