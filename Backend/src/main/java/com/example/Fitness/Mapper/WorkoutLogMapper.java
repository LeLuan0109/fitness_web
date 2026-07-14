package com.example.Fitness.Mapper;

import com.example.Fitness.DTO.response.workout_logs.WorkoutLogResponse;
import com.example.Fitness.Model.WorkoutLogs;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WorkoutLogMapper {
    @Mapping(target = "exerciseName", source = "exercise.name")
    @Mapping(target = "thumbnail", source = "exercise.thumbnail")
    @Mapping(target = "reps", source = "actualReps")
    @Mapping(target = "weight", source = "actualWeights")
    @Mapping(target = "duration", source = "actualDuration")
    @Mapping(target = "setNumber", source = "setNumber")
    WorkoutLogResponse toWorkoutLogResponse(WorkoutLogs workoutLogs);

    List<WorkoutLogResponse> toWorkoutLogResponseList(List<WorkoutLogs> workoutLogsList);
}
