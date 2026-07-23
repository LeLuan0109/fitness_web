package com.example.Fitness.DTO.response;

import com.example.Fitness.DTO.response.workout_plans.PlanResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Một kế hoạch được đề xuất kèm điểm khớp và lý do khớp (sinh tự động từ scoring). */
@Data
@Builder
public class ScoredPlanSuggestion {
    private PlanResponse plan;
    private int matchScore;          // điểm khớp (cao = phù hợp hơn)
    private List<String> reasons;    // lý do khớp: ✅ điểm mạnh, ⚠️ điểm lệch
}
