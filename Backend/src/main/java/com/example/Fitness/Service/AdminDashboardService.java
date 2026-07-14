package com.example.Fitness.Service;

import com.example.Fitness.DTO.response.admin.DashboardStatsResponse;
import com.example.Fitness.DTO.response.common.ChartDataResponseByDate;
import com.example.Fitness.DTO.response.common.ChartResponse;
import com.example.Fitness.Enum.FitnessGoal;
import com.example.Fitness.Repository.RNutrition.MenuRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Repository.WorkoutPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final MenuRepository menuRepository;
    private final WorkoutPlanRepository workoutPlanRepository;

    public DashboardStatsResponse getStats() {
        Long totalUsers = userRepository.countByIsLockedFalse();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        Long newUsers = userRepository.countByCreatedAtAfter(startOfDay);

        Long totalMenus = menuRepository.countByIsDefaultTrueAndIsDeletedFalse();
        Long totalPlans = workoutPlanRepository.countByIsDefaultTrueAndIsDeletedFalse();

        return DashboardStatsResponse.builder()
                .totalActivateUsers(totalUsers)
                .newUsersToday(newUsers)
                .totalSystemMenus(totalMenus)
                .totalSystemPlans(totalPlans)
                .build();
    }

    public List<ChartResponse> getUserGrowthChart(int year) {
        List<Object[]> rawData = userRepository.countUsersByMonth(year);
        Map<Integer, Long> dataMap = new HashMap<>();
        for (Object[] row : rawData) {
            dataMap.put((Integer) row[0], (Long) row[1]);
        }

        List<ChartResponse> chartData = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            Long count = dataMap.getOrDefault(month, 0L);
            chartData.add(ChartResponse.builder()
                    .label("Tháng " + month)
                    .value(count)
                    .build());
        }

        return chartData;
    }

    // --- 2. BIỂU ĐỒ TỶ LỆ MỤC TIÊU (Pie Chart) ---
    public List<ChartResponse> getUserGoalPercentChart() {
        List<Object[]> rawData = userRepository.countUsersByFitnessGoal();
        long totalUsersWithGoal = 0;
        for (Object[] row : rawData) {
            totalUsersWithGoal += (Long) row[1];
        }

        List<ChartResponse> chartData = new ArrayList<>();

        if (totalUsersWithGoal == 0) return chartData;

        for (Object[] row : rawData) {
            FitnessGoal goal = (FitnessGoal) row[0];
            Long count = (Long) row[1];
            String label = (goal != null) ? goal.getDescription() : "Chưa xác định";

            // Tính phần trăm: (count / total) * 100
            // Làm tròn 2 chữ số thập phân
            double percent = (double) count / totalUsersWithGoal * 100;
            percent = Math.round(percent * 100.0) / 100.0;

            chartData.add(ChartResponse.builder()
                    .label(label)
                    .value(percent)
                    .build());
        }

        return chartData;
    }
}
