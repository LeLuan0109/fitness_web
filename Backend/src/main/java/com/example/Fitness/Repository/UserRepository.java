package com.example.Fitness.Repository;

import com.example.Fitness.Model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<User> searchUsers(String keyword, Pageable pageable);

    long countByIsLockedFalse();
    long countByCreatedAtAfter(LocalDateTime date);

    @Query("SELECT u.fitnessGoal, COUNT(u) " +
            "FROM User u " +
            "WHERE u.isLocked = false " +
            "GROUP BY u.fitnessGoal")
    List<Object[]> countUsersByFitnessGoal();

    @Query("SELECT MONTH(u.createdAt), COUNT(u) " +
            "FROM User u " +
            "WHERE u.isLocked = false AND YEAR(u.createdAt) = :year " +
            "GROUP BY MONTH(u.createdAt) " +
            "ORDER BY MONTH(u.createdAt) ASC")
    List<Object[]> countUsersByMonth(@Param("year") int year);

    // Lay danh sach nguoi dung chua tap
    @Query(value = """
        SELECT DISTINCT u.id, u.current_streak
        FROM users u
        JOIN workoutplan p ON u.id = p.user_id
        JOIN workoutday d ON p.id = d.workout_plan_id
        WHERE d.day_of_week = :dayOfWeek
        AND p.is_deleted = false
        AND p.start_date <= :today
        AND DATEDIFF(:today, p.start_date) < (COALESCE(p.duration_week, 4) * 7)
        AND u.id NOT IN (
            SELECT h.user_id FROM workoutlogs h
            WHERE DATE(h.created_at) = :today
        )
    """, nativeQuery = true)
    List<Object[]> findUsersMissedWorkout(@Param("dayOfWeek") int dayOfWeek, @Param("today") LocalDate today);

    @Modifying
    @Query(value = """
        UPDATE users u
        SET u.current_streak = 0
        WHERE u.current_streak > 0
        AND u.id NOT IN (
            SELECT h.user_id
            FROM workoutlogs h
            WHERE DATE(h.created_at) = :yesterday
        )
    """, nativeQuery = true)
    void resetStreakForLazyUsers(@Param("yesterday") LocalDate yesterday);
}
