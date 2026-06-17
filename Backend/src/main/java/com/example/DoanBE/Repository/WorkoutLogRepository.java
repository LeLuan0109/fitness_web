package com.example.DoanBE.Repository;

import com.example.DoanBE.Model.WorkoutLogs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLogs, Long> {
    // Tính tổng calo tiêu thụ của User (All time)
    @Query("SELECT COALESCE(SUM(w.caloriesBurned), 0) FROM WorkoutLogs w WHERE w.user.id = :userId")
    Double sumTotalCaloriesByUserId(@Param("userId") Long userId);

    // Tính tổng thời gian tập (giây) của User (All time)
    @Query("SELECT COALESCE(SUM(w.actualDuration), 0) FROM WorkoutLogs w WHERE w.user.id = :userId")
    Integer sumTotalDurationByUserId(@Param("userId") Long userId);

    // Đếm tổng số buổi tập (Dựa trên số ngày khác nhau đã log) - All time
    @Query("SELECT COUNT(DISTINCT DATE(w.createdAt)) FROM WorkoutLogs w WHERE w.user.id = :userId")
    Integer countTotalWorkoutsByUserId(@Param("userId") Long userId);

    // Lấy logs trong khoảng thời gian (Ví dụ: từ đầu tháng đến cuối tháng)
    @Query("SELECT w FROM WorkoutLogs w WHERE w.user.id = :userId AND w.createdAt BETWEEN :startDate AND :endDate ORDER BY w.createdAt DESC")
    List<WorkoutLogs> findLogsByUserIdAndDateRange(@Param("userId") Long userId,
                                                   @Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);

    @Query("SELECT w FROM WorkoutLogs w " +
            "WHERE w.user.id = :userId " +
            "AND (:startDate IS NULL OR w.createdAt >= :startDate) " +
            "AND (:endDate IS NULL OR w.createdAt <= :endDate) " +
            "AND (:exerciseId IS NULL OR w.exercise.id = :exerciseId) " +
            "ORDER BY w.createdAt DESC, w.id ASC")
    List<WorkoutLogs> searchLogs(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("exerciseId") Long exerciseId
    );

    @Query("SELECT w FROM WorkoutLogs w " +
            "WHERE w.user.id = :userId " +
            "AND w.workoutDay.id = :workoutDayId " +
            "AND w.exercise.id = :exerciseId " +
            "ORDER BY w.setNumber ASC")
    List<WorkoutLogs> findByWorkoutDayAndExercise(
            @Param("userId") Long userId,
            @Param("workoutDayId") Long workoutDayId,
            @Param("exerciseId") Long exerciseId
    );

    @Query("SELECT l FROM WorkoutLogs l " +
            "WHERE l.user.id = :userId " +
            "AND l.workoutDay.workoutPlan.id = :planId " +
            "AND l.createdAt BETWEEN :startDate AND :endDate")
    List<WorkoutLogs> findAllByUserIdAndPlanIdAndDate(
            @Param("userId") Long userId,
            @Param("planId") Long planId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT CAST(w.createdAt AS date) as day, SUM(w.caloriesBurned) as totalCal " +
            "FROM WorkoutLogs w " +
            "WHERE w.user.id = :userId " +
            "AND w.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY CAST(w.createdAt AS date) " +
            "ORDER BY CAST(w.createdAt AS date) ASC")
    List<Object[]> getCaloriesChartData(@Param("userId") Long userId,
                                        @Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);

    // 4. Lấy dữ liệu biểu đồ Cường độ (Volume = Reps * Weight)
    @Query("SELECT CAST(w.createdAt AS date) as day, " +
            "SUM(w.actualReps * (CASE " +
            "    WHEN w.actualWeights > 0 THEN w.actualWeights " +
            "    WHEN w.user.weight > 0 THEN w.user.weight " +
            "    ELSE 1 END)) as totalVolume " +
            "FROM WorkoutLogs w " +
            "WHERE w.user.id = :userId " +
            "AND w.createdAt BETWEEN :startDate AND :endDate " +
            "GROUP BY CAST(w.createdAt AS date) " +
            "ORDER BY CAST(w.createdAt AS date) ASC")
    List<Object[]> getIntensityChartData(@Param("userId") Long userId,
                                         @Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    boolean existsByUserIdAndCreatedAtBetween(Long userId, LocalDateTime start, LocalDateTime end);
}
