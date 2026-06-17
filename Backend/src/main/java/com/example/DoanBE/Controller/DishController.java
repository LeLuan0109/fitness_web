package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.request.DishRequest;
import com.example.DoanBE.DTO.response.Nutrition.DishResponse;
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.common.Pagination;
import com.example.DoanBE.Service.DishService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dishes")
@RequiredArgsConstructor
public class DishController {
    private final DishService dishService;

    @GetMapping
    public ResponseEntity<?> getAllDishes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer cookingTime
    ) {
        try {
            // 1. Lấy kết quả dạng Page từ Service
            Page<DishResponse> result = dishService.getDishes(search, cookingTime, PageRequest.of(page,
                    size));

            // 2. Tách Pagination (Meta data)
            Pagination pageMeta = Pagination.builder()
                    .page(result.getNumber())
                    .pageSize(result.getSize())
                    .totalPages(result.getTotalPages())
                    .total(result.getTotalElements())
                    .hasMore(result.hasNext())
                    .build();

            // 3. Lấy List Content (Data thực tế)
            List<DishResponse> listData = result.getContent();

            // 4. Trả về ApiResponse với data là List và meta là Pagination
            return ResponseEntity.ok(ApiResponse.<List<DishResponse>>builder()
                    .status(true)
                    .data(listData) // Trả về List thay vì Page
                    .meta(pageMeta) // Kèm theo thông tin phân trang
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDishDetail(@PathVariable Long id) {
        try {
            DishResponse result = dishService.getDishDetail(id);
            return ResponseEntity.ok(ApiResponse.<DishResponse>builder().status(true).data(result).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createDish(@ModelAttribute DishRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.<DishResponse>builder().status(true).data(dishService.createDish(request)).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateDish(@PathVariable Long id, @ModelAttribute DishRequest request) {
        try {
            DishResponse result = dishService.updateDish(id, request);
            return ResponseEntity.ok(ApiResponse.<DishResponse>builder().status(true).data(result).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDish(@PathVariable Long id) {
        try {
            dishService.deleteDish(id);
            return ResponseEntity.ok(ApiResponse.<String>builder().status(true).data("Xóa thành công món ăn ID: " + id).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

}