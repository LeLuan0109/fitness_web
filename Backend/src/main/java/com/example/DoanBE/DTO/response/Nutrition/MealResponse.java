package com.example.DoanBE.DTO.response.Nutrition;

import com.example.DoanBE.Enum.MealType;
import lombok.Data;
import java.util.List;

@Data
public class MealResponse {
    private Long id;
    private String name;
    private MealType mealType;

    private Float calories;
    private Float protein;
    private Float carbs;
    private Float fat;
    private List<MealDishResponse> dishes;
}