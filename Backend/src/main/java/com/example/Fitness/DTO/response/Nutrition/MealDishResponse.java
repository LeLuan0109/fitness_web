package com.example.Fitness.DTO.response.Nutrition;

import lombok.Data;

@Data
public class MealDishResponse {
    private Long dishId;
    private String name;
    private String image;
    private Integer quantity;
    private Float totalCalories;   // calo * quantity
    private Float totalProtein; // Mới
    private Float totalCarbs;   // Mới
    private Float totalFat;
}