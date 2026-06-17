package com.example.DoanBE.DTO.response.workout_plans;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanWeekResponse {
    private Integer weekNumber;
    private List<PlanDayResponse> days;
}
