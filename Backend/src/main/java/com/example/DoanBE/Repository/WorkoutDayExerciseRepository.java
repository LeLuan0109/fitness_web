package com.example.DoanBE.Repository;

import com.example.DoanBE.Model.WorkoutDayExercises;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutDayExerciseRepository extends JpaRepository<WorkoutDayExercises, Long> {
}
