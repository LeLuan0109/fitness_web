package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.Model.MuscleGroup;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MuscleGroupMapper {
    @Mapping(target = "label", source = "muscleGroup.name")
    @Mapping(target = "value", source = "muscleGroup.id")
    SelectOptions toSelectOptions(MuscleGroup muscleGroup);
}
