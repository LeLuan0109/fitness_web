package com.example.Fitness.Repository.RNutrition;

import com.example.Fitness.Model.Nutrition.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeightLogRepository extends JpaRepository<WeightLog, Long> {
    Optional<WeightLog> findByUserIdAndLogDate(Long userId, LocalDate logDate);

    List<WeightLog> findByUserIdOrderByLogDateAsc(Long userId);

    @Query("SELECT w FROM WeightLog w WHERE w.user.id = :userId ORDER BY w.logDate DESC")
    List<WeightLog> findLatest(@Param("userId") Long userId, org.springframework.data.domain.Pageable pageable);
}
