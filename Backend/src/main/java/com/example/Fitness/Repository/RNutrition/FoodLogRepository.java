package com.example.Fitness.Repository.RNutrition;

import com.example.Fitness.Model.Nutrition.FoodLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodLogRepository extends JpaRepository<FoodLog, Long> {

    @Query("SELECT f FROM FoodLog f JOIN FETCH f.dish " +
            "WHERE f.user.id = :userId AND f.logDate = :date " +
            "ORDER BY f.createdAt ASC")
    List<FoodLog> findByUserAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    // Tổng macro theo từng ngày trong khoảng [from, to] (cho xem theo tuần/tháng)
    @Query("SELECT f.logDate, " +
            "SUM(COALESCE(f.dish.calories, 0) * f.quantity), " +
            "SUM(COALESCE(f.dish.protein, 0) * f.quantity), " +
            "SUM(COALESCE(f.dish.carbs, 0) * f.quantity), " +
            "SUM(COALESCE(f.dish.fat, 0) * f.quantity) " +
            "FROM FoodLog f " +
            "WHERE f.user.id = :userId AND f.logDate BETWEEN :from AND :to " +
            "GROUP BY f.logDate ORDER BY f.logDate ASC")
    List<Object[]> sumMacrosByDateRange(@Param("userId") Long userId,
                                        @Param("from") LocalDate from,
                                        @Param("to") LocalDate to);
}
