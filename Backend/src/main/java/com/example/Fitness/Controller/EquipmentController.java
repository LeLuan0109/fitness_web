package com.example.Fitness.Controller;

import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.DTO.response.common.SelectOptions;
import com.example.Fitness.Service.EquipmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/equipment")
@Tag(name = "Equipment controller")
@RequiredArgsConstructor
public class EquipmentController {
    private final EquipmentService equipmentService;

    @GetMapping("/select-options")
    public ResponseEntity<?> getSelectOptions() {
        List<SelectOptions> selectOptions = equipmentService.getEquipmentOptions();
        return ResponseEntity.ok(ApiResponse.builder().status(true).data(selectOptions).build());
    }
}
