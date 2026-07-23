package com.example.Fitness.Repository.RNutrition;

import com.example.Fitness.Model.Nutrition.DailyCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyCheckinRepository extends JpaRepository<DailyCheckin, Long> {
    Optional<DailyCheckin> findByUserIdAndLogDate(Long userId, LocalDate logDate);
}
