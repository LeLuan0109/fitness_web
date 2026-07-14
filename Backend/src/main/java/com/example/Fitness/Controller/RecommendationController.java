package com.example.Fitness.Controller;

import com.example.Fitness.DTO.response.SuggestionResponseDTO;
import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.DTO.response.common.Pagination;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getRecommendations(@PathVariable Long userId) throws DataNotFoundException {
        SuggestionResponseDTO result = recommendationService.getRecommendation(userId);

        // Tạo Meta Data giả lập (để khớp với cấu trúc ApiResponse chung)
        int totalItems = result.getSuggestedMenus() != null ? result.getSuggestedMenus().size() : 0;

        Pagination meta = Pagination.builder()
                .page(0)
                .pageSize(totalItems > 0 ? totalItems : 10)
                .totalPages(1)
                .total(totalItems)
                .hasMore(false)
                .build();

        return ResponseEntity.ok(ApiResponse.<SuggestionResponseDTO>builder()
                .status(true)
                .data(result)
                .meta(meta)
                .build());
    }
}