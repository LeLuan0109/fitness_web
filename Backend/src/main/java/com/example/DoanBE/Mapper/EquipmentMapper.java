package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.Model.Equipment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EquipmentMapper {
    @Mapping(target = "label", source = "equipment.name")
    @Mapping(target = "value", source = "equipment.id")
    SelectOptions toSelectOptions(Equipment equipment);
}
