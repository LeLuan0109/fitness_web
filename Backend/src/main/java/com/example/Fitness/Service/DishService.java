package com.example.Fitness.Service;

import com.example.Fitness.DTO.request.DishIngredientRequest;
import com.example.Fitness.DTO.request.DishRequest;
import com.example.Fitness.DTO.response.Nutrition.DishIngredientResponse;
import com.example.Fitness.DTO.response.Nutrition.DishResponse;
import com.example.Fitness.DTO.response.Nutrition.IngredientResponse;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Model.Nutrition.Dish;
import com.example.Fitness.Model.Nutrition.DishIngredient;
import com.example.Fitness.Model.Nutrition.Ingredient;
import com.example.Fitness.Repository.IngredientRepository;
import com.example.Fitness.Repository.RNutrition.DishRepository;
import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishService {

    private final DishRepository dishRepository;
    private final IngredientRepository ingredientRepository;
    private final FileUploadService fileUploadService;

    public DishResponse createDish(DishRequest request) throws IOException {
        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            imageUrl = fileUploadService.uploadImage(request.getImage(), "dishes");
        }

        // 2. Map thông tin cơ bản
        Dish dish = new Dish();
        dish.setName(request.getName());
        dish.setCookingTime(request.getCookingTime());
        dish.setCalories(request.getCalories());
        dish.setProtein(request.getProtein());
        dish.setFat(request.getFat());
        dish.setCarbs(request.getCarbs());
        dish.setPreparation(request.getPreparation());
        dish.setImage(imageUrl);
        dish.setIsDeleted(false);

        // 3. Xử lý danh sách nguyên liệu (Map Request -> Entity)
        if (request.getIngredients() != null && !request.getIngredients().isEmpty()) {
            List<DishIngredient> dishIngredients = new ArrayList<>();
            for (DishIngredientRequest itemReq : request.getIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(itemReq.getIngredientId())
                        .orElseThrow(() -> new RuntimeException("Nguyên liệu ID " + itemReq.getIngredientId() + " không tồn tại"));

                DishIngredient dishIngredient = new DishIngredient();
                dishIngredient.setDish(dish);
                dishIngredient.setIngredient(ingredient);
                dishIngredient.setQuantity(itemReq.getQuantity());
                dishIngredient.setUnit(itemReq.getUnit());
                dishIngredient.setPreparationNote(itemReq.getPreparationNote());

                dishIngredients.add(dishIngredient);
            }
            dish.setIngredients(dishIngredients);
        }

        Dish savedDish = dishRepository.save(dish);
        return mapToResponse(savedDish);
    }

    public DishResponse updateDish(Long id, DishRequest request) throws IOException, DataNotFoundException {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn ID: " + id));

        // 1. Update thông tin cơ bản
        if (request.getName() != null) dish.setName(request.getName());
        if (request.getCookingTime() != null) dish.setCookingTime(request.getCookingTime());
        if (request.getCalories() != null) dish.setCalories(request.getCalories());
        if (request.getProtein() != null) dish.setProtein(request.getProtein());
        if (request.getFat() != null) dish.setFat(request.getFat());
        if (request.getCarbs() != null) dish.setCarbs(request.getCarbs());
        if (request.getPreparation() != null) dish.setPreparation(request.getPreparation());

        // 2. Update ảnh (Nếu có file mới)
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            if (dish.getImage() != null) {
                try {
                    String oldPublicId = fileUploadService.getPublicIdFromUrl(dish.getImage());
                    fileUploadService.deleteFile(oldPublicId);
                } catch (Exception e) {
                    // Log warning, không nên chặn luồng chính
                    System.err.println("Lỗi xóa ảnh cũ: " + e.getMessage());
                }
            }
            String newImageUrl = fileUploadService.uploadImage(request.getImage(), "dishes");
            dish.setImage(newImageUrl);
        }

        // 3. Update danh sách nguyên liệu
        if (request.getIngredients() != null) {
            // Ta thao tác trực tiếp trên list hiện có của Entity
            if (dish.getIngredients() == null) {
                dish.setIngredients(new ArrayList<>());
            }
            dish.getIngredients().clear(); // Đánh dấu các item cũ để xóa (orphan removal)

            for (DishIngredientRequest itemReq : request.getIngredients()) {
                Ingredient ingredient = ingredientRepository.findById(itemReq.getIngredientId())
                        .orElseThrow(() -> new DataNotFoundException("Nguyên liệu ID " + itemReq.getIngredientId() + " không tồn " +
                                "tại"));

                DishIngredient dishIngredient = new DishIngredient();
                dishIngredient.setDish(dish); // Quan trọng
                dishIngredient.setIngredient(ingredient);
                dishIngredient.setQuantity(itemReq.getQuantity());
                dishIngredient.setUnit(itemReq.getUnit());
                dishIngredient.setPreparationNote(itemReq.getPreparationNote());

                dish.getIngredients().add(dishIngredient);
            }
        }

        Dish savedDish = dishRepository.save(dish);
        return mapToResponse(savedDish);
    }

    public Page<DishResponse> getDishes(String name, Integer maxCookingTime, Pageable pageable) {
        Specification<Dish> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("isDeleted"), false)); // Chỉ lấy món chưa xóa

            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
            }
            if (maxCookingTime != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("cookingTime"), maxCookingTime));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return dishRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    public DishResponse getDishDetail(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn ID: " + id));
        if (Boolean.TRUE.equals(dish.getIsDeleted())) {
            throw new RuntimeException("Món ăn này đã bị xóa.");
        }
        return mapToResponse(dish);
    }

    @Transactional
    public void deleteDish(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món ăn ID: " + id));

        // Soft delete (Xóa mềm)
        dish.setIsDeleted(true);
        dishRepository.save(dish);
    }

    private DishResponse mapToResponse(Dish dish) {
        // Map danh sách nguyên liệu
        List<DishIngredientResponse> ingredientsResp = new ArrayList<>();
        if (dish.getIngredients() != null) {
            ingredientsResp = dish.getIngredients().stream().map(di ->
                    DishIngredientResponse.builder()
                            .id(di.getId())
                            .quantity(di.getQuantity())
                            .unit(di.getUnit())
                            .preparationNote(di.getPreparationNote())
                            .ingredient(IngredientResponse.builder()
                                    .id(di.getIngredient().getId())
                                    .name(di.getIngredient().getName())
                                    .image(di.getIngredient().getImage())
                                    .standardUnit(di.getIngredient().getStandardUnit())
                                    .caloriesPerUnit(di.getIngredient().getCaloriesPerUnit())
                                    .build())
                            .build()
            ).collect(Collectors.toList());
        }

        return DishResponse.builder()
                .id(dish.getId())
                .name(dish.getName())
                .cookingTime(dish.getCookingTime())
                .image(dish.getImage())
                .calories(dish.getCalories())
                .protein(dish.getProtein())
                .fat(dish.getFat())
                .carbs(dish.getCarbs())
                .preparation(dish.getPreparation())
                .ingredients(ingredientsResp)
                .build();
    }
}