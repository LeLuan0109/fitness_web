package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.workout_plans.PlanDayResponse;
import com.example.DoanBE.DTO.response.workout_plans.PlanExerciseDetailResponse;
import com.example.DoanBE.Model.WorkoutDay;
import com.example.DoanBE.Model.WorkoutDayExercises;
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
