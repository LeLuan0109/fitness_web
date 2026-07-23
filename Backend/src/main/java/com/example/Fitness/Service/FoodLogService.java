package com.example.Fitness.Service;

import com.example.Fitness.DTO.request.AddFoodLogRequest;
import com.example.Fitness.DTO.response.Nutrition.FoodDiaryResponse;
import com.example.Fitness.Enum.FitnessGoal;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Model.Nutrition.Dish;
import com.example.Fitness.Model.Nutrition.FoodLog;
import com.example.Fitness.Model.User;
import com.example.Fitness.Repository.RNutrition.DishRepository;
import com.example.Fitness.Repository.RNutrition.FoodLogRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Utils.HealthCalculatorUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FoodLogService {

    private final FoodLogRepository foodLogRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;

    public FoodDiaryResponse addLog(AddFoodLogRequest request) throws DataNotFoundException {
        User user = getCurrentUser();

        // Món tham chiếu là tùy chọn (có thể ăn món ngoài catalog)
        Dish dish = null;
        if (request.getDishId() != null) {
            dish = dishRepository.findById(request.getDishId())
                    .orElseThrow(() -> new DataNotFoundException("Không tìm thấy món ăn"));
        }

        // Bắt buộc: hoặc có món catalog, hoặc nhập calo thực tế, hoặc có tên món tự nhập
        if (dish == null && request.getActualCalories() == null
                && (request.getCustomName() == null || request.getCustomName().isBlank())) {
            throw new IllegalArgumentException("Cần chọn món, hoặc nhập tên món + số calo thực tế.");
        }

        LocalDate date = (request.getDate() != null) ? request.getDate() : LocalDate.now();
        int qty = (request.getQuantity() != null && request.getQuantity() > 0) ? request.getQuantity() : 1;

        FoodLog log = FoodLog.builder()
                .user(user)
                .dish(dish)
                .customName(request.getCustomName())
                .quantity(qty)
                .actualCalories(request.getActualCalories())
                .actualProtein(request.getActualProtein())
                .actualCarbs(request.getActualCarbs())
                .actualFat(request.getActualFat())
                .logDate(date)
                .mealType(request.getMealType() != null ? request.getMealType() : "OTHER")
                .build();
        foodLogRepository.save(log);

        return getDiary(date);
    }

    public FoodDiaryResponse getDiary(LocalDate date) {
        User user = getCurrentUser();
        LocalDate d = (date != null) ? date : LocalDate.now();
        List<FoodLog> logs = foodLogRepository.findByUserAndDate(user.getId(), d);

        List<FoodDiaryResponse.FoodLogItem> items = new ArrayList<>();
        double totalCal = 0, totalPro = 0, totalCarb = 0, totalFat = 0;

        for (FoodLog log : logs) {
            Dish dish = log.getDish();
            int q = log.getQuantity() != null ? log.getQuantity() : 1;
            // Ưu tiên calo/macro THỰC TẾ người dùng nhập; nếu không có thì lấy dish×quantity
            double cal = log.getActualCalories() != null ? log.getActualCalories() : nz(dish != null ? dish.getCalories() : null) * q;
            double pro = log.getActualProtein() != null ? log.getActualProtein() : nz(dish != null ? dish.getProtein() : null) * q;
            double carb = log.getActualCarbs() != null ? log.getActualCarbs() : nz(dish != null ? dish.getCarbs() : null) * q;
            double fat = log.getActualFat() != null ? log.getActualFat() : nz(dish != null ? dish.getFat() : null) * q;

            totalCal += cal; totalPro += pro; totalCarb += carb; totalFat += fat;

            items.add(FoodDiaryResponse.FoodLogItem.builder()
                    .id(log.getId())
                    .dishId(dish != null ? dish.getId() : null)
                    .dishName(dish != null ? dish.getName() : log.getCustomName())
                    .image(dish != null ? dish.getImage() : null)
                    .quantity(q)
                    .mealType(log.getMealType())
                    .calories(round1(cal))
                    .protein(round1(pro))
                    .carbs(round1(carb))
                    .fat(round1(fat))
                    .build());
        }

        double[] target = computeTarget(user);

        return FoodDiaryResponse.builder()
                .date(d.toString())
                .items(items)
                .totalCalories(round1(totalCal))
                .totalProtein(round1(totalPro))
                .totalCarbs(round1(totalCarb))
                .totalFat(round1(totalFat))
                .targetCalories(round1(target[0]))
                .targetProtein(round1(target[1]))
                .targetCarbs(round1(target[2]))
                .targetFat(round1(target[3]))
                .build();
    }

    /** Tổng hợp macro theo khoảng ngày (xem theo tuần/tháng). */
    public com.example.Fitness.DTO.response.Nutrition.FoodDiarySummaryResponse getSummary(
            LocalDate from, LocalDate to) {
        User user = getCurrentUser();
        LocalDate f = (from != null) ? from : LocalDate.now().minusDays(6);
        LocalDate t = (to != null) ? to : LocalDate.now();

        List<Object[]> rows = foodLogRepository.sumMacrosByDateRange(user.getId(), f, t);

        List<com.example.Fitness.DTO.response.Nutrition.FoodDiarySummaryResponse.DayMacro> days = new ArrayList<>();
        double sumCal = 0, sumPro = 0, sumCarb = 0, sumFat = 0;
        for (Object[] r : rows) {
            double cal = r[1] != null ? ((Number) r[1]).doubleValue() : 0;
            double pro = r[2] != null ? ((Number) r[2]).doubleValue() : 0;
            double carb = r[3] != null ? ((Number) r[3]).doubleValue() : 0;
            double fat = r[4] != null ? ((Number) r[4]).doubleValue() : 0;
            sumCal += cal; sumPro += pro; sumCarb += carb; sumFat += fat;
            days.add(com.example.Fitness.DTO.response.Nutrition.FoodDiarySummaryResponse.DayMacro.builder()
                    .date(String.valueOf(r[0]))
                    .calories(round1(cal)).protein(round1(pro)).carbs(round1(carb)).fat(round1(fat))
                    .build());
        }
        int n = Math.max(1, days.size());
        double[] target = computeTarget(user);

        return com.example.Fitness.DTO.response.Nutrition.FoodDiarySummaryResponse.builder()
                .fromDate(f.toString())
                .toDate(t.toString())
                .days(days)
                .avgCalories(round1(sumCal / n))
                .avgProtein(round1(sumPro / n))
                .avgCarbs(round1(sumCarb / n))
                .avgFat(round1(sumFat / n))
                .targetCalories(round1(target[0]))
                .targetProtein(round1(target[1]))
                .targetCarbs(round1(target[2]))
                .targetFat(round1(target[3]))
                .build();
    }

    public void deleteLog(Long id) throws DataNotFoundException {
        User user = getCurrentUser();
        FoodLog log = foodLogRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy bản ghi"));
        if (!log.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền xóa bản ghi này");
        }
        foodLogRepository.delete(log);
    }

    /** Tính mục tiêu [calo, protein(g), carbs(g), fat(g)] từ TDEE + goal. */
    private double[] computeTarget(User user) {
        double tdee = 2000; // mặc định nếu thiếu dữ liệu
        if (user.getWeight() != null && user.getHeight() != null && user.getDateOfBirth() != null) {
            int age = HealthCalculatorUtils.calculateAge(user.getDateOfBirth());
            double bmr = HealthCalculatorUtils.calculateBMR(
                    user.getWeight().doubleValue(), user.getHeight().doubleValue(), age, user.getSex());
            tdee = HealthCalculatorUtils.calculateTDEE(bmr, user.getActivityLevel());
        }

        double targetCal = tdee;
        FitnessGoal goal = user.getFitnessGoal();
        if (goal != null) {
            switch (goal) {
                case LOSE_WEIGHT -> targetCal = tdee - 500;
                case GAIN_WEIGHT -> targetCal = tdee + 500;
                case MUSCLE_GAIN -> targetCal = tdee + 300;
                default -> targetCal = tdee;
            }
        }
        if (targetCal < 1200) targetCal = 1200;

        // Chia macro: 30% đạm, 40% tinh bột, 30% béo (4/4/9 kcal/g)
        double protein = targetCal * 0.30 / 4.0;
        double carbs = targetCal * 0.40 / 4.0;
        double fat = targetCal * 0.30 / 9.0;
        return new double[]{targetCal, protein, carbs, fat};
    }

    private double nz(Float v) {
        return v != null ? v : 0.0;
    }

    private double round1(double v) {
        return Math.round(v * 10) / 10.0;
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }
}
