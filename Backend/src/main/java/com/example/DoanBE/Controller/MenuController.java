package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.request.MenuRequest;
import com.example.DoanBE.DTO.response.Nutrition.MenuListResponse;
import com.example.DoanBE.DTO.response.Nutrition.MenuResponse;
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.common.Pagination;
import com.example.DoanBE.Enum.FitnessGoal;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Service.MenuService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/menus")
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;
    private final ObjectMapper objectMapper;

    @GetMapping("/public")
    public ResponseEntity<?> getPublicMenus(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) FitnessGoal goal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Float minCalories,
            @RequestParam(required = false) Float maxCalories,
            @RequestParam(required = false) Float minProtein,
            @RequestParam(required = false) Float maxProtein,
            @RequestParam(required = false) Float minCarbs,
            @RequestParam(required = false) Float maxCarbs,
            @RequestParam(required = false) Float minFat,
            @RequestParam(required = false) Float maxFat
    ) {
        Page<MenuListResponse> result = menuService.getPublicMenus(
                search, goal,
                minCalories, maxCalories,
                minProtein, maxProtein,
                minCarbs, maxCarbs,
                minFat, maxFat,
                PageRequest.of(page, size)
        );

        // Tách Pagination meta data
        Pagination pageMeta = Pagination.builder()
                .page(result.getNumber())
                .pageSize(result.getSize())
                .totalPages(result.getTotalPages())
                .total(result.getTotalElements())
                .hasMore(result.hasNext())
                .build();

        // Trả về List data kèm meta
        return ResponseEntity.ok(ApiResponse.<List<MenuListResponse>>builder()
                .status(true)
                .data(result.getContent())
                .meta(pageMeta)
                .build());
    }

    @GetMapping("/my-menus")
    public ResponseEntity<?> getMyMenus(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) FitnessGoal goal,
            @RequestParam(required = false) Float minCalories,
            @RequestParam(required = false) Float maxCalories,
            @RequestParam(required = false) Float minProtein,
            @RequestParam(required = false) Float maxProtein,
            @RequestParam(required = false) Float minCarbs,
            @RequestParam(required = false) Float maxCarbs,
            @RequestParam(required = false) Float minFat,
            @RequestParam(required = false) Float maxFat,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws DataNotFoundException {
        Page<MenuListResponse> result = menuService.getMyMenus(
                search, goal,
                minCalories, maxCalories,
                minProtein, maxProtein,
                minCarbs, maxCarbs,
                minFat, maxFat,
                PageRequest.of(page, size)
        );

        // Tách Pagination meta data
        Pagination pageMeta = Pagination.builder()
                .page(result.getNumber())
                .pageSize(result.getSize())
                .totalPages(result.getTotalPages())
                .total(result.getTotalElements())
                .hasMore(result.hasNext())
                .build();

        // Trả về List data kèm meta
        return ResponseEntity.ok(ApiResponse.<List<MenuListResponse>>builder()
                .status(true)
                .data(result.getContent())
                .meta(pageMeta)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuDetail(@PathVariable Long id) throws DataNotFoundException {
        return ResponseEntity.ok(ApiResponse.<MenuResponse>builder().status(true).data(menuService.getMenuDetail(id)).build());
    }

    @PostMapping
    public ResponseEntity<?> createMenu(@RequestBody MenuRequest request) throws IOException, DataNotFoundException {
        MenuResponse result = menuService.createMenu(request, null);

        return ResponseEntity.ok(ApiResponse.<MenuResponse>builder()
                .status(true)
                .data(result)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenu(
            @PathVariable Long id,
            @RequestBody MenuRequest request
    ) throws IOException, DataNotFoundException {
        MenuResponse result = menuService.updateMenu(id, request, null);

        return ResponseEntity.ok(ApiResponse.<MenuResponse>builder()
                .status(true)
                .data(result)
                .build());
    }

    @PostMapping("/{id}/clone")
    public ResponseEntity<?> cloneMenu(@PathVariable Long id) throws DataNotFoundException {
        return ResponseEntity.ok(ApiResponse.<MenuResponse>builder().status(true).data(menuService.cloneMenu(id)).build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenu(@PathVariable Long id) throws DataNotFoundException {
        menuService.deleteMenu(id);
        return ResponseEntity.ok(ApiResponse.<String>builder().status(true).data("Deleted successfully").build());
    }
}