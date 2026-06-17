package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.request.LogWorkoutRequest;
import com.example.DoanBE.DTO.request.WorkoutLogSearchRequest;
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.workout_logs.WorkoutHistoryResponse;
import com.example.DoanBE.DTO.response.workout_logs.WorkoutLogResponse;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Service.WorkoutLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/workout-logs")
@Tag(name = "Workout Log Controller")
@RequiredArgsConstructor
public class WorkoutLogController {
    private final WorkoutLogService workoutLogService;

    @PostMapping
    @Operation(summary = "Ghi log tập luyện", description = "Lưu thông tin 1 set tập (reps, weight, time) và tự động tính calo")
    public ResponseEntity<?> logWorkoutSet(@Valid @RequestBody LogWorkoutRequest request) {
        try {
            WorkoutLogResponse savedLog = workoutLogService.logSet(request);
            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false)
                    .data(e.getMessage())
                    .build());
        }
    }

    @GetMapping
    @Operation(summary = "Xem lịch sử tập theo ngày", description = "Lấy danh sách các bài đã tập trong một ngày cụ thể")
    public ResponseEntity<?> getLogsByDate(
            @RequestParam("date") @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate date
    ) {
        try {
            List<WorkoutLogResponse> logs = workoutLogService.getLogsByDate(date);

            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(logs)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false)
                    .data(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/history")
    @Operation(summary = "Lấy lịch sử tập luyện (Tổng hợp)", description = "Trả về danh sách lịch sử được gom nhóm theo ngày và tổng hợp số liệu")
    public ResponseEntity<?> getWorkoutHistory(
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate toDate,
            @RequestParam(required = false) Long exerciseId
    ) {
        try {
            WorkoutLogSearchRequest request = new WorkoutLogSearchRequest();
            request.setFromDate(fromDate);
            request.setToDate(toDate);
            request.setExerciseId(exerciseId);

            List<WorkoutHistoryResponse> history = workoutLogService.getWorkoutHistory(request);

            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(history)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false)
                    .data(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/plan-day/{dayId}/exercise/{exerciseId}")
    @Operation(summary = "Lấy logs theo WorkoutDay và Exercise")
    public ResponseEntity<?> getLogsByWorkoutDayAndExercise(
            @PathVariable Long dayId,
            @PathVariable Long exerciseId
    ) {
        try {
            List<WorkoutLogResponse> logs = workoutLogService.getLogsByDayAndExercise(dayId, exerciseId);

            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(logs)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false)
                    .data(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getWorkoutLogStatistics() {
        try {
            var data = workoutLogService.getWorkoutLogStatistics();
            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(data)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false)
                    .data(e.getMessage())
                    .build());
        }
    }
}
