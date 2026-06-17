package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.DTO.response.common.ChartResponse;
import com.example.DoanBE.Service.AdminDashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/admin/dashboard")
@Tag(name = "Admin dashboard controller")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.builder()
                .status(true)
                .data(dashboardService.getStats())
                .build());
    }

    @GetMapping("/chart/users")
    public ResponseEntity<?> getUserGrowthChart(@RequestParam(defaultValue = "0") int year) {
        if (year == 0) {
            year = LocalDate.now().getYear();
        }

        List<ChartResponse> data = dashboardService.getUserGrowthChart(year);

        return ResponseEntity.ok(ApiResponse.<List<ChartResponse>>builder()
                .status(true)
                .data(data)
                .build());
    }

    @GetMapping("/chart/goals")
    public ResponseEntity<?> getUserGoalChart() {
        List<ChartResponse> data = dashboardService.getUserGoalPercentChart();

        return ResponseEntity.ok(ApiResponse.<List<ChartResponse>>builder()
                .status(true)
                .data(data)
                .build());
    }
}
