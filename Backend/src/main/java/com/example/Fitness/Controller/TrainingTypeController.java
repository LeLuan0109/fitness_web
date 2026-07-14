package com.example.Fitness.Controller;

import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.Service.TrainingTypeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/training-type")
@Tag(name = "Training type controller")
@RequiredArgsConstructor
public class TrainingTypeController {
    private final TrainingTypeService trainingTypeService;

    @GetMapping("/select-options")
    public ResponseEntity<?> getSelectOptions() {   
        List<SelectOptions> selectOptions = trainingTypeService.getTrainingTypeOptions();
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(selectOptions).build());
    }
}
