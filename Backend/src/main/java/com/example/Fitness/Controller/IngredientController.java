package com.example.Fitness.Controller;

import com.example.Fitness.DTO.request.IngredientRequest;
import com.example.Fitness.DTO.response.Nutrition.IngredientResponse;
import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.DTO.response.common.Pagination;
import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.DTO.response.ingredients.IngredientDetailResponse;
import com.example.Fitness.Enum.UnitType;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Service.IngredientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/ingredients")
@Tag(name = "Ingredient controller")
@RequiredArgsConstructor
public class IngredientController {
    private final IngredientService ingredientService;

    @GetMapping("/select-options")
    public ResponseEntity<?> getSelectOptions() {
        List<SelectOptions> selectOptions = ingredientService.getSelectOptions();
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(selectOptions).build());
    }

    @GetMapping("/units")
    public ResponseEntity<?> getUnitOptions() {
        // Convert Enum thành List<SelectOptions>
        List<SelectOptions> options = Arrays.stream(UnitType.values())
                .map(unit -> SelectOptions.builder()
                        .label(unit.getLabel())
                        .value(unit.getValue())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<SelectOptions>>builder()
                .status(true)
                .data(options)
                .build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @Valid @ModelAttribute IngredientRequest request
    ) throws IOException {

        return ResponseEntity.ok(ApiResponse.<IngredientDetailResponse>builder()
                .status(true)
                .data(ingredientService.createIngredient(request))
                .build());
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @ModelAttribute IngredientRequest request
    ) throws IOException, DataNotFoundException {

        return ResponseEntity.ok(ApiResponse.<IngredientDetailResponse>builder()
                .status(true)
                .data(ingredientService.updateIngredient(id, request))
                .build());
    }

    @GetMapping
    public ResponseEntity<?> getIngredients(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<IngredientDetailResponse> result = ingredientService.getIngredients(
                search, PageRequest.of(page, size, Sort.by("id").descending())
        );

        Pagination meta = Pagination.builder()
                .page(result.getNumber())
                .pageSize(result.getSize())
                .totalPages(result.getTotalPages())
                .total(result.getTotalElements())
                .hasMore(result.hasNext())
                .build();

        return ResponseEntity.ok(ApiResponse.<List<IngredientDetailResponse>>builder()
                .status(true)
                .data(result.getContent())
                .meta(meta)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDetail(@PathVariable Long id) throws DataNotFoundException {
        return ResponseEntity.ok(ApiResponse.<IngredientDetailResponse>builder()
                .status(true)
                .data(ingredientService.getIngredientById(id))
                .build());
    }
}
