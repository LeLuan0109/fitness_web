package com.example.Fitness.Model.Nutrition;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "dishes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "cooking_duration_minutes")
    private Integer  cookingTime;


    private Float calories;
    private Float protein;
    private Float fat;

    @Column(name = "carbs")
    private Float carbs;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DishIngredient> ingredients;

    @Column(name = "recipe", columnDefinition = "TEXT")
    private String preparation;

    @Column(name = "image")
    private String image;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
}