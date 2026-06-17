package com.example.DoanBE.Model.Nutrition;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dish_ingredients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DishIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link ngược về Món ăn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id")
    @JsonIgnore
    private Dish dish;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    private Float quantity;

    // Đơn vị tính trong món này (Ví dụ: "gram", "ml", "thìa", "quả")
    private String unit;

    // Ghi chú sơ chế (Ví dụ: "Thái hạt lựu", "Băm nhỏ")
    @Column(name = "preparation_note")
    private String preparationNote;
}
