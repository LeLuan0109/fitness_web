package com.example.DoanBE.Repository;

import com.example.DoanBE.Enum.DifficultyLevel;
import com.example.DoanBE.Enum.FitnessGoal;
import com.example.DoanBE.Model.WorkoutPlan;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long>, JpaSpecificationExecutor<WorkoutPlan> {
    @Query("SELECT p FROM WorkoutPlan p " +
            "LEFT JOIN WorkoutLogs l ON l.workoutDay.workoutPlan.id = p.id " +
            "WHERE p.isDefault = true AND p.isDeleted = false " +
            "GROUP BY p.id " +
            "ORDER BY COUNT(DISTINCT l.user.id) DESC")
    List<WorkoutPlan> findOutstandingPlans(Pageable pageable);
    List<WorkoutPlan> findByTargetGoalAndDifficultyLevelAndIsDeletedFalse(FitnessGoal targetGoal, DifficultyLevel difficultyLevel);
    @Query("SELECT w FROM WorkoutPlan w WHERE w.isDefault = true " +
            "AND w.isDeleted = false " +
            "AND w.targetGoal = :goal " +
            "AND w.difficultyLevel = :level")
    List<WorkoutPlan> findMatchingPlans(@Param("goal") FitnessGoal goal,
                                        @Param("level") DifficultyLevel level);

    Long countByIsDefaultTrueAndIsDeletedFalse();

    @Query("SELECT DISTINCT p FROM WorkoutPlan p " +
            "LEFT JOIN FETCH p.workoutDays wd " +
            "WHERE p.user.id = :userId " +
            "AND wd.dayOfWeek = :dayOfWeek " +
            "AND p.startDate IS NOT NULL " +
            "AND p.startDate <= :targetDate " +
            "AND p.isDeleted = false " +
            "AND wd.isDeleted = false")
    List<WorkoutPlan> findActivePlansByDate(
            @Param("userId") Long userId,
            @Param("dayOfWeek") Integer dayOfWeek,
            @Param("targetDate") LocalDate targetDate
    );
}
