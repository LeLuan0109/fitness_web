package com.example.DoanBE.DTO.request;

import com.example.DoanBE.Enum.DifficultyLevel;
import com.example.DoanBE.Enum.FitnessGoal;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PlanSearchRequest {
    private String keyword;
    private FitnessGoal goal;
    private DifficultyLevel level;
    private Integer duration;
    private Integer page;
    private Integer limit;
}
