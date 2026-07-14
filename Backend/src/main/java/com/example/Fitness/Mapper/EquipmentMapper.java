package com.example.Fitness.Mapper;

import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.Model.Equipment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EquipmentMapper {
    @Mapping(target = "label", source = "equipment.name")
    @Mapping(target = "value", source = "equipment.id")
    SelectOptions toSelectOptions(Equipment equipment);
}
