package com.example.Fitness.Repository.RNutrition;

import com.example.Fitness.Model.Nutrition.DailyMenuSelection;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyMenuSelectionRepository extends JpaRepository<DailyMenuSelection, Long> {
    @EntityGraph(attributePaths = {"menu", "menu.meals", "menu.meals.mealDishes", "menu.meals.mealDishes.dish"})
    Optional<DailyMenuSelection> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    @EntityGraph(attributePaths = {"menu", "menu.meals", "menu.meals.mealDishes", "menu.meals.mealDishes.dish"})
    List<DailyMenuSelection> findByUserIdAndLogDateBetween(Long userId, LocalDate from, LocalDate to);
}
