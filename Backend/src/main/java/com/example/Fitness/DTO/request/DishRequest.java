package com.example.Fitness.DTO.request;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DishRequest {
    private String name;
    private Integer cookingTime;

    // Các chỉ số này có thể tự tính hoặc nhập tay, ở đây giả sử nhập tay
    private Float calories;
    private Float protein;
    private Float fat;
    private Float carbs;

    private String preparation; // Map với recipe
    private MultipartFile image;

    // Danh sách nguyên liệu (ID nguyên liệu + số lượng)
    // Frontend gửi dạng: ingredients[0].ingredientId=1, ingredients[0].quantity=200...
    private List<DishIngredientRequest> ingredients;
}