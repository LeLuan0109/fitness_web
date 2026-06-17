package com.example.DoanBE.Mapper;

import com.example.DoanBE.DTO.request.MenuRequest;
import com.example.DoanBE.DTO.response.Nutrition.MealDishResponse;
import com.example.DoanBE.DTO.response.Nutrition.MealResponse;
import com.example.DoanBE.DTO.response.Nutrition.MenuListResponse;
import com.example.DoanBE.DTO.response.Nutrition.MenuResponse;
import com.example.DoanBE.Model.Nutrition.Meal;
import com.example.DoanBE.Model.Nutrition.MealDish;
import com.example.DoanBE.Model.Nutrition.Menu;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MenuMapper {

    // --- 1. Entity -> Response ---
    @Mapping(source = "user.id", target = "creatorId")
    @Mapping(source = "user.name", target = "creatorName")
    @Mapping(source = "user.avatar", target = "creatorAvatar")
    @Mapping(source = "displayOrder", target = "displayOrder")
    MenuResponse toMenuResponse(Menu menu);

    @Mapping(target = "dishes", source = "mealDishes")
    MealResponse toMealResponse(Meal meal);

    @Mapping(target = "dishId", source = "dish.id")
    @Mapping(target = "name", source = "dish.name")
    @Mapping(target = "image", source = "dish.image")
    @Mapping(target = "totalProtein", expression = "java(calculateTotal(mealDish.getDish().getProtein(), mealDish.getQuantity()))")
    @Mapping(target = "totalCarbs", expression = "java(calculateTotal(mealDish.getDish().getCarbs(), mealDish.getQuantity()))")
    @Mapping(target = "totalFat", expression = "java(calculateTotal(mealDish.getDish().getFat(), mealDish.getQuantity()))")
    MealDishResponse toMealDishResponse(MealDish mealDish);

    // --- 2. Request -> Entity (Partial Update) ---
    // nullValuePropertyMappingStrategy = IGNORE giúp giữ nguyên giá trị cũ nếu request gửi null
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "meals", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "calories", ignore = true)
    @Mapping(target = "protein", ignore = true)
    @Mapping(target = "carbs", ignore = true)
    @Mapping(target = "fat", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "isDeleted", ignore = true)
    @Mapping(target = "displayOrder", ignore = true)
    void updateMenuFromRequest(@MappingTarget Menu menu, MenuRequest request);

    MenuListResponse toMenuListResponse(Menu menu);

    default Float calculateTotal(Float valuePerUnit, Integer quantity) {
        if (valuePerUnit == null || quantity == null) return 0f;
        return valuePerUnit * quantity;
    }
}