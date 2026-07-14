package com.example.Fitness.Repository;

import com.example.Fitness.Model.WorkoutDayExercises;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutDayExercisesRepository extends JpaRepository<WorkoutDayExercises, Long> {
    boolean existsByExercisesId(Long exercisesId);
}
