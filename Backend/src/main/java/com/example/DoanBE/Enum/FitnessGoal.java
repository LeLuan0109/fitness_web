package com.example.DoanBE.Enum;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum FitnessGoal {
    LOSE_WEIGHT("Giảm cân"),
    GAIN_WEIGHT("Tăng cân"),
    MUSCLE_GAIN("Tăng cơ"),
    SHAPE_BODY("Giữ dáng / Săn chắc"),
    OTHERS("Khác");

    private final String description;
}
