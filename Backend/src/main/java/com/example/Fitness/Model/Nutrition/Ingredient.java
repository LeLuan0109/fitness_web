package com.example.Fitness.Model.Nutrition;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String image;

    // Đơn vị đo tiêu chuẩn (gram, ml, cái...)
    // Dùng để quy đổi sau này nếu cần
    @Column(name = "standard_unit")
    private String standardUnit;

    // Calo trên mỗi 100g (hoặc per unit) - Tùy chọn để tính calo tự động
    @Column(name = "calories_per_unit")
    private Float caloriesPerUnit;
}
