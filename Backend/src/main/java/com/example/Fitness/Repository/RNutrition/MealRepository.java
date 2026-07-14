package com.example.Fitness.Repository.RNutrition;

import com.example.Fitness.Model.Nutrition.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
}