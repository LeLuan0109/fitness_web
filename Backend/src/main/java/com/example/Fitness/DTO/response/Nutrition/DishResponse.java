package com.example.Fitness.DTO.response.Nutrition;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishResponse {
    private Long id;
    private String name;
    private Integer cookingTime;
    private String image;
    private Float calories;
    private Float protein;
    private Float fat;
    private Float carbs;
    private List<DishIngredientResponse> ingredients;
    private String preparation;
}