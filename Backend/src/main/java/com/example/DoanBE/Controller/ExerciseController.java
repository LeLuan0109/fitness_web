package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.request.ExerciseRequest;
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.ExerciseResponse;
import com.example.DoanBE.DTO.response.common.Pagination;
import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.DTO.response.errors.ErrorResponse;
import com.example.DoanBE.DTO.response.errors.TError;
import com.example.DoanBE.DTO.response.exercises.ExercisesDetailResponse;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Service.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<?> getAllExercises(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Long muscleId,
            @RequestParam(required = false) Long typeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ExerciseResponse> result = exerciseService.getExercises(search, level, muscleId, typeId, pageable);
            Pagination pageMeta = Pagination.builder()
                    .page(result.getNumber())
                    .pageSize(result.getSize())
                    .totalPages(result.getTotalPages())
                    .total(result.getTotalElements())
                    .hasMore(result.hasNext())
                    .build();
            List<ExerciseResponse> exerciseResponses = result.getContent();
            return ResponseEntity.ok(ApiResponse.<List<ExerciseResponse>>builder().status(true).data(exerciseResponses).meta(pageMeta).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getExerciseDetail(@PathVariable Long id) {
        try {
            ExerciseResponse result = exerciseService.getExerciseDetail(id);
            return ResponseEntity.ok(ApiResponse.<ExerciseResponse>builder().status(true).data(result).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping("/form/{id}")
    public ResponseEntity<?> getExerciseFormDetail(@PathVariable Long id) {
        try {
            ExercisesDetailResponse result = exerciseService.getExerciseDetailResponse(id);
            return ResponseEntity.ok(ApiResponse.builder().status(true).data(result).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createExercise(@ModelAttribute ExerciseRequest request) {
        try {
            ExerciseResponse result = exerciseService.createExercise(request);

            return ResponseEntity.ok(ApiResponse.<ExerciseResponse>builder().status(true).data(result).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateExercise(@PathVariable Long id, @ModelAttribute ExerciseRequest request) {
        try {
            ExerciseResponse result = exerciseService.updateExercise(id, request);

            return ResponseEntity.ok(ApiResponse.<ExerciseResponse>builder().status(true).data(result).build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteExercise(@PathVariable Long id) {
        try {
            exerciseService.deleteExercise(id);
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .status(true)
                    .data("Xóa thành công bài tập có ID: " + id)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping("/{id}/related")
    @Operation(description = "Gợi ý 4 bài tập tương tự dựa trên nhóm cơ, loại hình và cấp độ")
    public ResponseEntity<?> getRelatedExercises(@PathVariable Long id) {
        try {
            List<ExerciseResponse> related = exerciseService.getRelatedExercises(id);

            return ResponseEntity.ok(ApiResponse.<List<ExerciseResponse>>builder()
                    .status(true)
                    .data(related)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.builder().status(false).data(e.getMessage()).build());
        }
    }

    @GetMapping("/select-options")
    public ResponseEntity<?> getSelectOptions() {
        List<SelectOptions> selectOptions = exerciseService.getExerciseOptions();
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(selectOptions).build());
    }
}