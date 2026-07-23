package com.example.Fitness.DTO.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Body cho API đề xuất nhãn kế hoạch: chỉ cần lịch tập chi tiết (các buổi + bài).
 * Dùng khi người tạo đang soạn kế hoạch và muốn xem nhãn hệ thống gợi ý trước khi lưu.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuggestPlanLabelRequest {
    @NotEmpty(message = "Lịch tập không được để trống")
    @Valid
    private List<PlanDayRequest> schedule;
}
