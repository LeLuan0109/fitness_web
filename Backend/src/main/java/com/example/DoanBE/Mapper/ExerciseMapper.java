package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.DTO.response.exercises.ExercisesDetailResponse;
import com.example.DoanBE.Model.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ExerciseMapper {
    @Mapping(target = "label", source = "exercises.name")
    @Mapping(target = "value", source = "exercises.id")
    SelectOptions toSelectOptions(Exercises exercises);

    @Mapping(target = "trainingTypeId", source = "trainingType.id")
    @Mapping(target = "equipments", source = "equipments", qualifiedByName = "mapEquipmentsToIds")
    @Mapping(target = "primaryMusclesIds", source = "exerciseMuscleGroups", qualifiedByName = "mapPrimaryMusclesToIds")
    @Mapping(target = "secondaryMusclesIds", source = "exerciseMuscleGroups", qualifiedByName = "mapSecondaryMusclesToIds")
    @Mapping(target = "steps", source = "steps", qualifiedByName = "mapStepsToStrings")
    @Mapping(target = "tips", source = "tips", qualifiedByName = "mapTipsToStrings")
    @Mapping(target = "mistakes", source = "mistakes", qualifiedByName = "mapMistakesToStrings")
    @Mapping(target = "benefits", source = "benefits", qualifiedByName = "mapBenefitsToStrings")
    @Mapping(target = "benefit", ignore = true) // Ignored vì DTO có cả List<String> benefits
    @Mapping(target = "met", source = "met")
    ExercisesDetailResponse toDetailResponse(Exercises entity);

    // --- Các hàm Helper để xử lý List ---

    @Named("mapEquipmentsToIds")
    default List<Long> mapEquipmentsToIds(java.util.Set<Equipment> equipments) {
        if (equipments == null) return Collections.emptyList();
        return equipments.stream().map(Equipment::getId).collect(Collectors.toList());
    }

    @Named("mapPrimaryMusclesToIds")
    default List<Long> mapPrimaryMusclesToIds(java.util.Set<ExerciseMuscleGroup> groups) {
        if (groups == null) return Collections.emptyList();
        return groups.stream()
                .filter(ExerciseMuscleGroup::isPrimary)
                .map(emg -> emg.getMuscleGroup().getId())
                .collect(Collectors.toList());
    }

    @Named("mapSecondaryMusclesToIds")
    default List<Long> mapSecondaryMusclesToIds(java.util.Set<ExerciseMuscleGroup> groups) {
        if (groups == null) return Collections.emptyList();
        return groups.stream()
                .filter(emg -> !emg.isPrimary())
                .map(emg -> emg.getMuscleGroup().getId())
                .collect(Collectors.toList());
    }

    @Named("mapStepsToStrings")
    default List<String> mapStepsToStrings(List<ExerciseStep> steps) {
        if (steps == null) return Collections.emptyList();
        return steps.stream().map(ExerciseStep::getInstruction).collect(Collectors.toList());
    }

    @Named("mapTipsToStrings")
    default List<String> mapTipsToStrings(List<ExerciseTip> tips) {
        if (tips == null) return Collections.emptyList();
        return tips.stream().map(ExerciseTip::getContent).collect(Collectors.toList());
    }

    @Named("mapMistakesToStrings")
    default List<String> mapMistakesToStrings(List<ExerciseMistake> mistakes) {
        if (mistakes == null) return Collections.emptyList();
        return mistakes.stream().map(ExerciseMistake::getContent).collect(Collectors.toList());
    }

    @Named("mapBenefitsToStrings")
    default List<String> mapBenefitsToStrings(List<ExerciseBenefit> benefits) {
        if (benefits == null) return Collections.emptyList();
        return benefits.stream().map(ExerciseBenefit::getContent).collect(Collectors.toList());
    }
}
