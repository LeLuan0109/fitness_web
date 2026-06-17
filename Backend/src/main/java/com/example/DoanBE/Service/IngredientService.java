package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.request.IngredientRequest;
import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.DTO.response.ingredients.IngredientDetailResponse;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Mapper.IngredientMapper;
import com.example.DoanBE.Model.Nutrition.Dish;
import com.example.DoanBE.Model.Nutrition.DishIngredient;
import com.example.DoanBE.Model.Nutrition.Ingredient;
import com.example.DoanBE.Repository.DishIngredientRepository;
import com.example.DoanBE.Repository.IngredientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class IngredientService {
    private final IngredientRepository ingredientRepository;
    private final IngredientMapper ingredientMapper;
    private final FileUploadService fileUploadService;
    private final DishIngredientRepository dishIngredientRepository;

    public List<SelectOptions> getSelectOptions() {
        return  ingredientRepository.findAll().stream().map(ingredientMapper::toSelectOptions).toList();
    }

    public Page<IngredientDetailResponse> getIngredients(String search, Pageable pageable) {
        Page<Ingredient> page;
        if (search != null && !search.isBlank()) {
            page = ingredientRepository.findByNameContainingIgnoreCase(search, pageable);
        } else {
            page = ingredientRepository.findAll(pageable);
        }
        return page.map(ingredientMapper::toResponse);
    }

    public IngredientDetailResponse getIngredientById(Long id) throws DataNotFoundException {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy nguyên liệu ID: " + id));
        return ingredientMapper.toResponse(ingredient);
    }

    @Transactional
    public IngredientDetailResponse createIngredient(IngredientRequest request) throws IOException {
        // MultipartFile image
        if (ingredientRepository.existsByName(request.getName())) {
            throw new RuntimeException("Tên nguyên liệu đã tồn tại!");
        }

        Ingredient ingredient = new Ingredient();
        ingredientMapper.updateFromRequest(ingredient, request);

        // Lấy ảnh từ DTO
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = fileUploadService.uploadImage(request.getImage(), "ingredients");
            ingredient.setImage(imageUrl);
        }

        Ingredient saved = ingredientRepository.save(ingredient);
        return ingredientMapper.toResponse(saved);
    }

    @Transactional
    public IngredientDetailResponse updateIngredient(Long id, IngredientRequest request) throws IOException, DataNotFoundException {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy nguyên liệu ID: " + id));
        boolean isUsedInDishes = dishIngredientRepository.existsByIngredientId(id);
        if (isUsedInDishes) {
            boolean isCoreInfoChanged =
                    !ingredient.getName().equals(request.getName()) ||
                            !ingredient.getStandardUnit().equals(request.getStandardUnit()) ||
                            !ingredient.getCaloriesPerUnit().equals(request.getCaloriesPerUnit());

            if (isCoreInfoChanged) {
                throw new RuntimeException("Nguyên liệu này đang được sử dụng trong các món ăn. Bạn chỉ được phép thay đổi hình ảnh, không được sửa tên hay chỉ số dinh dưỡng!");
            }

        } else {
            if (!ingredient.getName().equalsIgnoreCase(request.getName())
                    && ingredientRepository.existsByName(request.getName())) {
                throw new RuntimeException("Tên nguyên liệu đã tồn tại!");
            }
            ingredientMapper.updateFromRequest(ingredient, request);
        }
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            if (ingredient.getImage() != null) {
                try {
                    String publicId = fileUploadService.getPublicIdFromUrl(ingredient.getImage());
                    fileUploadService.deleteFile(publicId);
                } catch (Exception e) {
                    System.err.println("Lỗi xóa ảnh cũ: " + e.getMessage());
                }
            }
            String imageUrl = fileUploadService.uploadImage(request.getImage(), "ingredients");
            ingredient.setImage(imageUrl);
        }
        Ingredient saved = ingredientRepository.save(ingredient);
        return ingredientMapper.toResponse(saved);
    }

}
