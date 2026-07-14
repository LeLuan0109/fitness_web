package com.example.Fitness.Repository;

import com.example.Fitness.Model.WorkoutDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutDayRepository extends JpaRepository<WorkoutDay, Long>, JpaSpecificationExecutor<WorkoutDay> {
    List<WorkoutDay> findByWorkoutPlanIdAndIsDeletedFalseOrderByWeekNumberAscDayInNumberAsc(Long planId);
    @Query("SELECT DISTINCT p.user.id, p.id, p.startDate, p.durationWeek " +
            "FROM WorkoutDay d " +
            "JOIN d.workoutPlan p " +
            "WHERE d.dayOfWeek = :dayOfWeek " +
            "AND d.isDeleted = false " +
            "AND p.isDeleted = false " +
            "AND p.isDefault = false " +
            "AND p.startDate IS NOT NULL " +
            "AND p.startDate <= :today")
    List<Object[]> findUserAndPlanIdsByDayOfWeek(
            @Param("dayOfWeek") Integer dayOfWeek,
            @Param("today") LocalDate today
    );
}
