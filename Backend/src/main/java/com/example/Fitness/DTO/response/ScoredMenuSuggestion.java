package com.example.Fitness.DTO.response;

import com.example.Fitness.DTO.response.Nutrition.MenuResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/** Một thực đơn được đề xuất kèm điểm khớp và lý do khớp. */
@Data
@Builder
public class ScoredMenuSuggestion {
    private MenuResponse menu;
    private int matchScore;
    private List<String> reasons;
}
