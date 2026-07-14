package com.example.Fitness.Mapper;

import com.example.Fitness.DTO.response.workout_plans.PlanDayResponse;
import com.example.Fitness.DTO.response.workout_plans.PlanExerciseDetailResponse;
import com.example.Fitness.Model.WorkoutDay;
import com.example.Fitness.Model.WorkoutDayExercises;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface WorkoutDayMapper {
    @Mapping(target = "exercises", source = "workoutDayExercises")
    PlanDayResponse toPlanDayResponse(WorkoutDay day);

    @Mapping(target = "exerciseId", source = "exercises.id")
    @Mapping(target = "exerciseName", source = "exercises.name")
    @Mapping(target = "thumbnail", source = "exercises.thumbnail")
    PlanExerciseDetailResponse toPlanExerciseDetailResponse(WorkoutDayExercises workoutDayExercises);
}
