package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.request.IngredientRequest;
import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.DTO.response.ingredients.IngredientDetailResponse;
import com.example.DoanBE.Enum.UnitType;
import com.example.DoanBE.Model.Nutrition.Ingredient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.Arrays;

@Mapper(componentModel = "spring")
public interface IngredientMapper {
    @Mapping(target = "label", source = "ingredient.name")
    @Mapping(target = "value", source = "ingredient.id")
    SelectOptions toSelectOptions(Ingredient ingredient);

    @Mapping(target = "standardUnitLabel", source = "standardUnit", qualifiedByName = "mapUnitToLabel")
    IngredientDetailResponse toResponse(Ingredient ingredient);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "image", ignore = true) // Ảnh xử lý riêng
    void updateFromRequest(@MappingTarget Ingredient ingredient, IngredientRequest request);

    // Helper: Chuyển đổi từ "g" -> "Gram (g)" để hiển thị
    @Named("mapUnitToLabel")
    default String mapUnitToLabel(String unitValue) {
        if (unitValue == null) return null;
        return Arrays.stream(UnitType.values())
                .filter(u -> u.getValue().equals(unitValue))
                .findFirst()
                .map(UnitType::getLabel)
                .orElse(unitValue);
    }
}
