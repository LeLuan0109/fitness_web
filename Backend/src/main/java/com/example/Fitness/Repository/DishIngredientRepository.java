package com.example.Fitness.Repository;

import com.example.Fitness.Model.Nutrition.DishIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DishIngredientRepository extends JpaRepository<DishIngredient, Long> {
    boolean existsByIngredientId(Long ingredientId);
}
