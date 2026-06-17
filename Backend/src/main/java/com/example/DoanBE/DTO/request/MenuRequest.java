package com.example.DoanBE.DTO.request;

import com.example.DoanBE.Enum.FitnessGoal;
import lombok.Data;
import java.util.List;

@Data
public class MenuRequest {
    private String name;
    private String description;
    private FitnessGoal fitnessGoal;
    private List<MealRequest> meals;
}