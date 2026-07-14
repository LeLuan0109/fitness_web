package com.example.Fitness.Enum;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MealType {
    BREAKFAST("Bữa sáng"),
    LUNCH("Bữa trưa"),
    DINNER("Bữa tối"),
    EXTRA_MEAL("Bữa phụ");

    private final String description;
}