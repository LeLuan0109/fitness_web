package com.example.Fitness.Model.Nutrition;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dishes_meal")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealDish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Meal meal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dish_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Dish dish;

    private Integer quantity;

    @Column(name = "total_calories")
    private Float totalCalories; // Calo = dish.calo * quantity
}