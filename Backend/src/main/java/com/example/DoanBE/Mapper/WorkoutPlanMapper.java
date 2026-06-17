package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.request.CreatePlanRequest;
import com.example.DoanBE.DTO.response.workout_plans.PlanDetailResponse;
import com.example.DoanBE.DTO.response.workout_plans.PlanResponse;
import com.example.DoanBE.Model.WorkoutPlan;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface WorkoutPlanMapper {
    PlanResponse toPlanResponse(WorkoutPlan plan);

    @Mapping(target = "weeks", ignore = true)
    PlanDetailResponse toPlanDetailResponse(WorkoutPlan plan);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isDefault", ignore = true)
    @Mapping(target = "targetGoal", source = "goal")
    @Mapping(target = "difficultyLevel", source = "level")
    WorkoutPlan toWorkoutPlan(CreatePlanRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isDefault", ignore = true)
    @Mapping(target = "targetGoal", source = "goal")
    @Mapping(target = "difficultyLevel", source = "level")
    void updateWorkoutPlanFromRequest(CreatePlanRequest request, @MappingTarget WorkoutPlan plan);
}
