package com.example.DoanBE.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishIngredientRequest {
    private Long ingredientId;
    private Float quantity;
    private String unit;
    private String preparationNote;
}
