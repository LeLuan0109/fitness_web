package com.example.Fitness.Mapper;

import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.Model.MuscleGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MuscleGroupMapper {
    @Mapping(target = "label", source = "muscleGroup.name")
    @Mapping(target = "value", source = "muscleGroup.id")
    SelectOptions toSelectOptions(MuscleGroup muscleGroup);
}
