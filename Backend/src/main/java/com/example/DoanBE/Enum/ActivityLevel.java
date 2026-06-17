package com.example.DoanBE.Enum;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ActivityLevel {
    SEDENTARY(1.2),         // Ít vận động
    LIGHTLY_ACTIVE(1.375),  // Vận động nhẹ
    MODERATELY_ACTIVE(1.55),// Vận động vừa
    VERY_ACTIVE(1.725),     // Năng động
    EXTRA_ACTIVE(1.9);      // Cường độ cao

    private final double pal; // Physical Activity Level
}
