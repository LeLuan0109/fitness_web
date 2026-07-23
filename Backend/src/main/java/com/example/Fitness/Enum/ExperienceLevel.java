package com.example.Fitness.Enum;

import com.example.Fitness.Enum.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Kinh nghiệm tập luyện tự khai của người dùng.
 * Dùng để suy ra độ khó phù hợp CHÍNH XÁC hơn so với mức vận động (PAL) —
 * vì PAL đo vận động sinh hoạt, không phản ánh kinh nghiệm phòng gym.
 */
@Getter
@AllArgsConstructor
public enum ExperienceLevel {
    NEW(DifficultyLevel.BEGINNER),          // Mới bắt đầu (< 6 tháng)
    INTERMEDIATE(DifficultyLevel.INTERMEDIATE), // Trung bình (6 tháng - 2 năm)
    EXPERT(DifficultyLevel.ADVANCED);       // Lâu năm (> 2 năm)

    /** Độ khó kế hoạch phù hợp tương ứng. */
    private final DifficultyLevel mappedDifficulty;
}
