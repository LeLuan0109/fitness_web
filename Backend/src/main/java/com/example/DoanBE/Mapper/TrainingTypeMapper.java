package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.Model.TrainingType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TrainingTypeMapper {
    @Mapping(target = "label", source = "trainingType.name")
    @Mapping(target = "value", source = "trainingType.id")
    SelectOptions toSelectOptions(TrainingType trainingType);
}
