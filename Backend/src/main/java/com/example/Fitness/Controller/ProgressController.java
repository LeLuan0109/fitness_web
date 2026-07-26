package com.example.Fitness.Controller;

import com.example.Fitness.DTO.request.DailyCheckinRequest;
import com.example.Fitness.DTO.request.LogWeightRequest;
import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.Service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;

@RestController
@RequestMapping("${api.prefix}/progress")
@Tag(name = "Progress controller - Tiến độ so với kỳ vọng")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @Operation(summary = "Tổng quan tiến độ 3 trụ (năng lượng, cân nặng, tuân thủ tập) + trạng thái")
    @GetMapping("/overview")
    public ResponseEntity<?> overview() {
        return ResponseEntity.ok(ApiResponse.builder()
                .status(true).data(progressService.getOverview()).build());
    }

    @Operation(summary = "Ghi cân nặng hôm nay (theo dõi tiến độ tới mục tiêu)")
    @PostMapping("/weight")
    public ResponseEntity<?> logWeight(@Valid @RequestBody LogWeightRequest request) {
        progressService.logWeight(request.getWeight(), request.getDate());
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(true).build());
    }

    @Operation(summary = "Ghi nước uống + trả lời có ăn đúng thực đơn không (Có/Không)")
    @PostMapping("/checkin")
    public ResponseEntity<?> checkin(@RequestBody DailyCheckinRequest request) {
        progressService.checkin(request.getWaterMl(), request.getFollowedMenu(), request.getDate());
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(true).build());
    }

    @Operation(summary = "Lịch tiến độ theo tháng: mỗi ngày gắn trạng thái tập + calo ăn/mục tiêu + cân nặng")
    @GetMapping("/calendar")
    public ResponseEntity<?> calendar(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM") YearMonth month) {
        return ResponseEntity.ok(ApiResponse.builder()
                .status(true).data(progressService.getCalendar(month)).build());
    }

    @Operation(summary = "Chi tiết 1 ngày trong lịch tiến độ (bài tập + món ăn) — dùng cho tooltip khi click 1 ô")
    @GetMapping("/day-detail")
    public ResponseEntity<?> dayDetail(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date,
            @RequestParam(required = false) Long workoutDayId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .status(true).data(progressService.getDayDetail(date, workoutDayId)).build());
    }
}
