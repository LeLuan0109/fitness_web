package com.example.DoanBE.Repository.RNutrition;

import com.example.DoanBE.Enum.FitnessGoal;
import com.example.DoanBE.Model.Nutrition.Menu;
import com.example.DoanBE.Model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long>, JpaSpecificationExecutor<Menu> {
    @EntityGraph(attributePaths = {"meals", "meals.mealDishes", "meals.mealDishes.dish"})
    Optional<Menu> findByIdAndIsDeletedFalse(Long id);
    @Query("SELECT MAX(m.displayOrder) FROM Menu m WHERE m.user.id = :userId AND m.isDeleted = false")
    Integer findMaxDisplayOrder(@Param("userId") Long userId);
    @Query("SELECT m FROM Menu m WHERE m.fitnessGoal = :goal " +
            "AND (m.isDeleted IS NULL OR m.isDeleted = false) " +
            "AND m.caloriesTarget BETWEEN :minCal AND :maxCal")
    List<Menu> findSuggestedMenus(@Param("goal") FitnessGoal goal,
                                  @Param("minCal") Float minCalories,
                                  @Param("maxCal") Float maxCalories);

    @Query("SELECT m FROM Menu m WHERE m.isDefault = true " +
            "AND m.isDeleted = false " +
            "AND m.fitnessGoal = :goal " +
            "AND m.caloriesTarget BETWEEN :minCal AND :maxCal")
    List<Menu> findMenusByRange(@Param("goal") FitnessGoal goal,
                                @Param("minCal") Float minCal,
                                @Param("maxCal") Float maxCal);

    @Query("SELECT m FROM Menu m WHERE m.isDefault = true " +
            "AND m.isDeleted = false " +
            "AND m.fitnessGoal = :goal " +
            "ORDER BY ABS(m.caloriesTarget - :targetCal) ASC")
    List<Menu> findMenusByClosestCalories(@Param("goal") FitnessGoal goal,
                                          @Param("targetCal") Float targetCal,
                                          Pageable pageable);

    Long countByIsDefaultTrueAndIsDeletedFalse();
}