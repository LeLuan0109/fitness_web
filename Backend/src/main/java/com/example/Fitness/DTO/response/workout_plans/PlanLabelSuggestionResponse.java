package com.example.Fitness.DTO.response.workout_plans;

import com.example.Fitness.Enum.DifficultyLevel;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Nhãn ĐỀ XUẤT TỰ ĐỘNG cho một kế hoạch tập, suy ra từ các bài bên trong.
 * Người tạo (Admin/User) có thể GIỮ nhãn này hoặc TỰ CHỌN nhãn khác để override.
 */
@Data
@Builder
public class PlanLabelSuggestionResponse {
    /** Độ khó đề xuất (bỏ phiếu theo ngưỡng ACSM/NSCA/Schoenfeld). */
    private DifficultyLevel suggestedDifficulty;

    /** Số buổi/tuần (đếm số ngày tập khác nhau). */
    private Integer daysPerWeek;

    /** Thời lượng ước tính mỗi buổi (phút). */
    private Integer estimatedDurationMinutes;

    /** Dụng cụ cần (gộp từ tất cả bài). */
    private List<String> requiredEquipment;

    /** Nhóm cơ tác động chính (gộp từ các bài). */
    private List<String> muscleGroups;

    /** Diễn giải minh bạch: mỗi tín hiệu bỏ phiếu ra bậc nào (để hiển thị & bảo vệ). */
    private List<String> difficultyReasoning;
}
