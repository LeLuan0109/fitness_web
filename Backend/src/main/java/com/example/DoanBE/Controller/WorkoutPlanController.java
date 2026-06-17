package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.request.CreatePlanRequest;
import com.example.DoanBE.DTO.request.PlanSearchRequest;
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.common.Pagination;
import com.example.DoanBE.DTO.response.errors.ErrorResponse;
import com.example.DoanBE.DTO.response.errors.TError;
import com.example.DoanBE.DTO.response.workout_plans.PlanDetailResponse;
import com.example.DoanBE.DTO.response.workout_plans.PlanResponse;
import com.example.DoanBE.DTO.response.workout_plans.WorkoutDayDetailResponse;
import com.example.DoanBE.Enum.DifficultyLevel;
import com.example.DoanBE.Enum.FitnessGoal;
import com.example.DoanBE.Model.WorkoutPlan;
import com.example.DoanBE.Service.WorkoutPlantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/workout-plan")
@Tag(name = "Workout plan controller")
@RequiredArgsConstructor
public class WorkoutPlanController {
    private final WorkoutPlantService workoutPlanService;

    @PostMapping
    public ResponseEntity<?> createPlan(@RequestBody CreatePlanRequest request) {
        WorkoutPlan savedPlan = workoutPlanService.createWorkoutPlan(request);
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(savedPlan.getId()).build());
    }

    @GetMapping(value = "/samples")
    public ResponseEntity<?> getSamplePlans(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) FitnessGoal goal,
            @RequestParam(required = false) DifficultyLevel level,
            @RequestParam(required = false) Integer duration,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        PlanSearchRequest request = PlanSearchRequest.builder()
                .keyword(keyword)
                .goal(goal)
                .level(level)
                .duration(duration)
                .page(page)
                .limit(limit)
                .build();
        Page<PlanResponse> planResponses = workoutPlanService.getSamplePlans(request);
        Pagination pagination = Pagination.builder().page(planResponses.getNumber())
                .pageSize(planResponses.getSize())
                .totalPages(planResponses.getTotalPages())
                .total(planResponses.getTotalElements())
                .hasMore(planResponses.hasNext())
                .build();
        return ResponseEntity.ok(ApiResponse.builder()
                .status(true)
                .data(planResponses.getContent())
                .meta(pagination)
                .build());
    }

    @GetMapping(value = "/mine")
    public ResponseEntity<?> getMyPlans(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) FitnessGoal goal,
            @RequestParam(required = false) DifficultyLevel level,
            @RequestParam(required = false) Integer duration,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer limit
    ) {
        PlanSearchRequest request = PlanSearchRequest.builder()
                .keyword(keyword)
                .goal(goal)
                .level(level)
                .duration(duration)
                .page(page)
                .limit(limit)
                .build();

        Page<PlanResponse> planResponses = workoutPlanService.getMyPlans(request);
        Pagination pagination = Pagination.builder().page(planResponses.getNumber())
                .pageSize(planResponses.getSize())
                .totalPages(planResponses.getTotalPages())
                .total(planResponses.getTotalElements())
                .hasMore(planResponses.hasNext())
                .build();
        return ResponseEntity.ok(ApiResponse.builder()
                .status(true)
                .data(planResponses.getContent())
                .meta(pagination)
                .build());
    }

    @GetMapping("/calendar")
    public ResponseEntity<?> getPlansByDate(
            @RequestParam("date") @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate date
    ) {
        try {
            List<PlanResponse> plans = workoutPlanService.getPlansBySpecificDate(date);

            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(plans)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false)
                    .data(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/day/{dayId}")
    @Operation(summary = "Lấy danh sách bài tập của một ngày cụ thể")
    public ResponseEntity<?> getExercisesByDay(@PathVariable Long dayId) {
        try {
            WorkoutDayDetailResponse response = workoutPlanService.getExercisesByDayId(dayId);

            return ResponseEntity.ok(ApiResponse.<WorkoutDayDetailResponse>builder()
                    .status(true)
                    .data(response)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder()
                    .status(false)
                    .data(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlanDetail(@PathVariable Long id) {
        try {
            PlanDetailResponse detail = workoutPlanService.getPlanDetail(id);

            return ResponseEntity.ok(
                    ApiResponse.<PlanDetailResponse>builder()
                            .status(true)
                            .data(detail)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlan(@PathVariable Long id, @RequestBody CreatePlanRequest request) {
        try {
            PlanDetailResponse updatedPlan = workoutPlanService.updatePlan(id, request);

            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(updatedPlan.getId())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable Long id) {
        try {
            workoutPlanService.deletePlan(id);

            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(true)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping("/outstanding")
    public ResponseEntity<?> getOutstandingPlans() {
        return ResponseEntity.ok(ApiResponse.builder()
                .status(true)
                .data(workoutPlanService.getOutstandingPlans())
                .build());
    }

    @PostMapping("/{id}/copy")
    public ResponseEntity<?> copyPlan(@PathVariable Long id) {
        try {
            Long newPlanId = workoutPlanService.copyPlan(id);

            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(newPlanId)
                    .build());
        } catch (Exception e) {
            TError tError = TError.builder().code("RUN_TIME_ERROR").message(e.getMessage()).build();
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error(tError).build());
        }
    }
}
