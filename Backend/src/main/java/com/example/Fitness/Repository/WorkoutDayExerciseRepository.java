package com.example.Fitness.Repository;

import com.example.Fitness.Model.WorkoutDayExercises;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutDayExerciseRepository extends JpaRepository<WorkoutDayExercises, Long> {
}
