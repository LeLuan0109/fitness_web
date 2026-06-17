package com.example.DoanBE.DTO.request;

import com.example.DoanBE.Enum.MealType;
import lombok.Data;
import java.util.List;

@Data
public class MealRequest {
    private String name;
    private MealType mealType; // Enum: BREAKFAST, LUNCH...
    private List<MealDishRequestDTO> dishes;
}