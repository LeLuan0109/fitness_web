package com.example.Fitness.DTO.response.ingredients;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class IngredientDetailResponse {
    private Long id;
    private String name;
    private String image;
    private String standardUnit;      // VD: "g"
    private String standardUnitLabel; // VD: "Gram (g)" - Trả thêm cái này để hiện thị cho đẹp
    private Float caloriesPerUnit;
}
