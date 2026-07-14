package com.example.Fitness.Controller;

import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.Enum.FitnessGoal;
import com.example.Fitness.Enum.MealType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/common")
public class CommonController {
    @GetMapping("/fitness-goals/select-options")
    public ResponseEntity<?> getFitnessGoalOptions() {
        List<SelectOptions> options = Arrays.stream(FitnessGoal.values())
                .map(goal -> SelectOptions.builder()
                        .label(goal.getDescription()) // Hiển thị: "Giảm cân"
                        .value(goal.name())           // Giá trị: "LOSE_WEIGHT"
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<SelectOptions>>builder()
                .status(true)
                .data(options)
                .build());
    }

    @GetMapping("/meal-types/select-options")
    public ResponseEntity<?> getMealTypeOptions() {
        List<SelectOptions> options = Arrays.stream(MealType.values())
                .map(meal -> SelectOptions.builder()
                        .label(meal.getDescription()) // Hiển thị: "Bữa sáng"
                        .value(meal.name())           // Giá trị gửi về DB: "BREAKFAST"
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<SelectOptions>>builder()
                .status(true)
                .data(options)
                .build());
    }
}
