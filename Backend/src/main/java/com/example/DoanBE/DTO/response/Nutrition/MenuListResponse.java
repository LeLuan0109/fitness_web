package com.example.DoanBE.DTO.response.Nutrition;

import com.example.DoanBE.Enum.FitnessGoal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuListResponse {
    private Long id;
    private Integer displayOrder;
    private String name;
    private String description;
    private FitnessGoal fitnessGoal;
    private Boolean isDefault;
    private Float calories;
    private Float protein;
    private Float carbs;
    private Float fat;
}
