package com.example.Fitness.Controller;

import com.example.Fitness.DTO.request.AddFoodLogRequest;
import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.Service.FoodLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("${api.prefix}/food-logs")
@Tag(name = "Food Log Controller")
@RequiredArgsConstructor
public class FoodLogController {

    private final FoodLogService foodLogService;

    @PostMapping
    @Operation(summary = "Thêm món đã ăn vào nhật ký")
    public ResponseEntity<?> addLog(@Valid @RequestBody AddFoodLogRequest request) {
        try {
            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(foodLogService.addLog(request))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping
    @Operation(summary = "Lấy nhật ký ăn theo ngày (kèm tổng macro + mục tiêu)")
    public ResponseEntity<?> getDiary(
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate date
    ) {
        try {
            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(foodLogService.getDiary(date))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping("/summary")
    @Operation(summary = "Tổng hợp macro theo khoảng ngày (tuần/tháng)")
    public ResponseEntity<?> getSummary(
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate to
    ) {
        try {
            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(foodLogService.getSummary(from, to))
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false).data(e.getMessage()).build());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa một món khỏi nhật ký")
    public ResponseEntity<?> deleteLog(@PathVariable Long id) {
        try {
            foodLogService.deleteLog(id);
            return ResponseEntity.ok(ApiResponse.builder().status(true).data(true).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false).data(e.getMessage()).build());
        }
    }
}
