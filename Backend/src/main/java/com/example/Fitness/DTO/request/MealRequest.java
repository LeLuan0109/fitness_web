package com.example.Fitness.DTO.request;

import com.example.Fitness.Enum.MealType;
import lombok.Data;
import java.util.List;

@Data
public class MealRequest {
    private String name;
    private MealType mealType; // Enum: BREAKFAST, LUNCH...
    private List<MealDishRequestDTO> dishes;
}