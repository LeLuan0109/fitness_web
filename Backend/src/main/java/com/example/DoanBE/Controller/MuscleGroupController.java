package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.common.SelectOptions;
import com.example.DoanBE.Service.MuscleGroupService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/muscle-group")
@Tag(name = "Muscle group controller")
@RequiredArgsConstructor
public class MuscleGroupController {
    private final MuscleGroupService muscleGroupService;

    @GetMapping("/select-options")
    public ResponseEntity<?> getSelectOptions() {
        List<SelectOptions> selectOptions = muscleGroupService.getMuscleGroupSelectOptions();
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(selectOptions).build());
    }
}
