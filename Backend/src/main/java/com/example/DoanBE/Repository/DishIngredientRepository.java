package com.example.DoanBE.Repository;

import com.example.DoanBE.Model.Nutrition.DishIngredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DishIngredientRepository extends JpaRepository<DishIngredient, Long> {
    boolean existsByIngredientId(Long ingredientId);
}
