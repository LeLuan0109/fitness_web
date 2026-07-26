package com.example.Fitness.Service;

import com.example.Fitness.DTO.request.AddFoodLogRequest;
import com.example.Fitness.DTO.request.ApplyMenuRequest;
import com.example.Fitness.DTO.response.Nutrition.FoodDiaryCalendarResponse;
import com.example.Fitness.DTO.response.Nutrition.FoodDiaryDayDetailResponse;
import com.example.Fitness.DTO.response.Nutrition.FoodDiaryResponse;
import com.example.Fitness.Enum.FitnessGoal;
import com.example.Fitness.Enum.MealType;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Model.Nutrition.DailyCheckin;
import com.example.Fitness.Model.Nutrition.DailyMenuSelection;
import com.example.Fitness.Model.Nutrition.Dish;
import com.example.Fitness.Model.Nutrition.FoodLog;
import com.example.Fitness.Model.Nutrition.Meal;
import com.example.Fitness.Model.Nutrition.MealDish;
import com.example.Fitness.Model.Nutrition.Menu;
import com.example.Fitness.Model.User;
import com.example.Fitness.Repository.RNutrition.DailyCheckinRepository;
import com.example.Fitness.Repository.RNutrition.DailyMenuSelectionRepository;
import com.example.Fitness.Repository.RNutrition.DishRepository;
import com.example.Fitness.Repository.RNutrition.FoodLogRepository;
import com.example.Fitness.Repository.RNutrition.MenuRepository;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Utils.HealthCalculatorUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FoodLogService {

    private static final java.time.ZoneId VN_ZONE = java.time.ZoneId.of("Asia/Ho_Chi_Minh");
    private static final MealType[] SLOT_ORDER = {MealType.BREAKFAST, MealType.LUNCH, MealType.EXTRA_MEAL, MealType.DINNER};
    private static final Map<MealType, String> SLOT_TIME = Map.of(
            MealType.BREAKFAST, "07:00",
            MealType.LUNCH, "12:00",
            MealType.EXTRA_MEAL, "15:00",
            MealType.DINNER, "19:00"
    );

    private final FoodLogRepository foodLogRepository;
    private final DishRepository dishRepository;
    private final UserRepository userRepository;
    private final MenuRepository menuRepository;
    private final DailyCheckinRepository dailyCheckinRepository;
    private final DailyMenuSelectionRepository dailyMenuSelectionRepository;

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

        LocalDate date = (request.getDate() != null) ? request.getDate() : LocalDate.now(VN_ZONE);
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
        LocalDate d = (date != null) ? date : LocalDate.now(VN_ZONE);
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

    // ===== Lịch nhật ký ăn (carousel % hoàn thành theo ngày) =====
    public FoodDiaryCalendarResponse getCalendar(LocalDate from, LocalDate to) {
        User user = getCurrentUser();
        LocalDate f = (from != null) ? from : LocalDate.now(VN_ZONE).minusDays(6);
        LocalDate t = (to != null) ? to : LocalDate.now(VN_ZONE);

        Menu fallbackMenu = menuRepository.findFirstByUserIdAndIsDefaultFalseAndIsDeletedFalseOrderByCreatedAtDesc(user.getId())
                .orElse(null);
        Map<LocalDate, Menu> selectedByDate = dailyMenuSelectionRepository.findByUserIdAndLogDateBetween(user.getId(), f, t)
                .stream()
                .collect(Collectors.toMap(DailyMenuSelection::getLogDate, DailyMenuSelection::getMenu, (a, b) -> b));

        List<FoodDiaryCalendarResponse.DayCell> days = new ArrayList<>();
        for (LocalDate d = f; !d.isAfter(t); d = d.plusDays(1)) {
            Menu menu = selectedByDate.getOrDefault(d, fallbackMenu);
            List<MealType> plannedSlots = resolvePlannedSlots(menu);
            List<FoodLog> logs = foodLogRepository.findByUserAndDate(user.getId(), d);
            long loggedSlots = plannedSlots.stream()
                    .filter(slot -> logs.stream().anyMatch(l -> slot.name().equals(l.getMealType())))
                    .count();
            double percent = plannedSlots.isEmpty() ? 0 : round1((double) loggedSlots / plannedSlots.size() * 100);

            days.add(FoodDiaryCalendarResponse.DayCell.builder()
                    .date(d.toString())
                    .completionPercent(percent)
                    .mealsLogged((int) loggedSlots)
                    .mealsPlanned(plannedSlots.size())
                    .build());
        }
        return FoodDiaryCalendarResponse.builder().days(days).build();
    }

    // ===== Chi tiết 1 ngày: timeline từng bữa (dự kiến vs thực tế) =====
    public FoodDiaryDayDetailResponse getDayDetail(LocalDate date) {
        User user = getCurrentUser();
        LocalDate d = (date != null) ? date : LocalDate.now(VN_ZONE);
        LocalDate today = LocalDate.now(VN_ZONE);

        Menu menu = resolveMenuForDate(user, d);
        List<MealType> plannedSlots = resolvePlannedSlots(menu);
        List<FoodLog> logs = foodLogRepository.findByUserAndDate(user.getId(), d);

        List<FoodDiaryDayDetailResponse.MealSlot> slots = new ArrayList<>();
        int loggedCount = 0;
        for (MealType slot : plannedSlots) {
            List<FoodLog> slotLogs = logs.stream()
                    .filter(l -> slot.name().equals(l.getMealType()))
                    .collect(Collectors.toList());

            String plannedDishName = resolvePlannedDishName(menu, slot);
            String status;
            String actualItemName = null;
            Double actualCal = null, actualPro = null, actualCarb = null, actualFat = null;

            if (!slotLogs.isEmpty()) {
                loggedCount++;
                actualItemName = slotLogs.stream()
                        .map(l -> l.getDish() != null ? l.getDish().getName() : l.getCustomName())
                        .collect(Collectors.joining(" + "));
                double cal = 0, pro = 0, carb = 0, fat = 0;
                for (FoodLog l : slotLogs) {
                    Dish dish = l.getDish();
                    int q = l.getQuantity() != null ? l.getQuantity() : 1;
                    cal += l.getActualCalories() != null ? l.getActualCalories() : nz(dish != null ? dish.getCalories() : null) * q;
                    pro += l.getActualProtein() != null ? l.getActualProtein() : nz(dish != null ? dish.getProtein() : null) * q;
                    carb += l.getActualCarbs() != null ? l.getActualCarbs() : nz(dish != null ? dish.getCarbs() : null) * q;
                    fat += l.getActualFat() != null ? l.getActualFat() : nz(dish != null ? dish.getFat() : null) * q;
                }
                actualCal = round1(cal); actualPro = round1(pro); actualCarb = round1(carb); actualFat = round1(fat);

                boolean matchesPlan = plannedDishName != null && sameDishCombo(plannedDishName, actualItemName);
                status = (plannedDishName == null || matchesPlan) ? "MATCH" : "CHANGED";
            } else if (d.isAfter(today)) {
                status = "PLANNED";
            } else if (d.isEqual(today) && LocalTime.now(VN_ZONE).isBefore(LocalTime.parse(SLOT_TIME.get(slot)))) {
                // Hôm nay nhưng chưa tới giờ ăn của bữa này -> vẫn coi là sắp tới, không phải "bỏ bữa"
                status = "PLANNED";
            } else {
                status = "SKIPPED";
            }

            slots.add(FoodDiaryDayDetailResponse.MealSlot.builder()
                    .mealType(slot.name())
                    .mealTypeLabel(slot.getDescription())
                    .time(SLOT_TIME.get(slot))
                    .plannedDishName(plannedDishName)
                    .actualItemName(actualItemName)
                    .actualCalories(actualCal).actualProtein(actualPro).actualCarbs(actualCarb).actualFat(actualFat)
                    .status(status)
                    .build());
        }

        double totalCal = 0, totalPro = 0, totalCarb = 0, totalFat = 0;
        for (FoodLog log : logs) {
            Dish dish = log.getDish();
            int q = log.getQuantity() != null ? log.getQuantity() : 1;
            totalCal += log.getActualCalories() != null ? log.getActualCalories() : nz(dish != null ? dish.getCalories() : null) * q;
            totalPro += log.getActualProtein() != null ? log.getActualProtein() : nz(dish != null ? dish.getProtein() : null) * q;
            totalCarb += log.getActualCarbs() != null ? log.getActualCarbs() : nz(dish != null ? dish.getCarbs() : null) * q;
            totalFat += log.getActualFat() != null ? log.getActualFat() : nz(dish != null ? dish.getFat() : null) * q;
        }
        double[] target = computeTarget(user);

        Integer waterMl = dailyCheckinRepository.findByUserIdAndLogDate(user.getId(), d)
                .map(DailyCheckin::getWaterMl).orElse(null);
        int waterTarget = user.getWeight() != null ? (int) Math.round(user.getWeight() * 35) : 2000;

        LocalDate weekStart = d.minusDays(6);
        int weekTotal = 0, weekLogged = 0;
        for (LocalDate wd = weekStart; !wd.isAfter(d); wd = wd.plusDays(1)) {
            List<FoodLog> wLogs = foodLogRepository.findByUserAndDate(user.getId(), wd);
            for (MealType slot : plannedSlots) {
                weekTotal++;
                if (wLogs.stream().anyMatch(l -> slot.name().equals(l.getMealType()))) weekLogged++;
            }
        }
        Double weekAdherence = weekTotal > 0 ? round1((double) weekLogged / weekTotal * 100) : null;

        return FoodDiaryDayDetailResponse.builder()
                .date(d.toString())
                .completionPercent(plannedSlots.isEmpty() ? 0 : round1((double) loggedCount / plannedSlots.size() * 100))
                .mealsLogged(loggedCount)
                .mealsPlanned(plannedSlots.size())
                .totalCalories(round1(totalCal)).targetCalories(round1(target[0]))
                .totalProtein(round1(totalPro)).targetProtein(round1(target[1]))
                .totalCarbs(round1(totalCarb)).targetCarbs(round1(target[2]))
                .totalFat(round1(totalFat)).targetFat(round1(target[3]))
                .waterMl(waterMl).waterTarget(waterTarget)
                .weekAdherencePercent(weekAdherence)
                .slots(slots)
                .build();
    }

    /** Áp dụng 1 thực đơn cho 1 ngày: ghi đè log ngày đó bằng đúng món của cả 4 bữa trong thực đơn. */
    public FoodDiaryDayDetailResponse applyMenu(ApplyMenuRequest request) throws DataNotFoundException {
        User user = getCurrentUser();
        if (request.getMenuId() == null) {
            throw new IllegalArgumentException("Cần chọn thực đơn");
        }
        Menu menu = menuRepository.findByIdAndIsDeletedFalse(request.getMenuId())
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy thực đơn"));

        boolean isOwner = menu.getUser() != null && menu.getUser().getId().equals(user.getId());
        if (!isOwner && !Boolean.TRUE.equals(menu.getIsDefault())) {
            throw new RuntimeException("Bạn không có quyền dùng thực đơn này");
        }

        LocalDate date = (request.getDate() != null) ? request.getDate() : LocalDate.now(VN_ZONE);

        foodLogRepository.deleteByUserAndDate(user.getId(), date);

        List<FoodLog> newLogs = new ArrayList<>();
        if (menu.getMeals() != null) {
            for (Meal meal : menu.getMeals()) {
                if (meal.getMealDishes() == null) continue;
                for (MealDish md : meal.getMealDishes()) {
                    if (md.getDish() == null) continue;
                    newLogs.add(FoodLog.builder()
                            .user(user)
                            .dish(md.getDish())
                            .quantity(md.getQuantity() != null ? md.getQuantity() : 1)
                            .logDate(date)
                            .mealType(meal.getMealType().name())
                            .build());
                }
            }
        }
        foodLogRepository.saveAll(newLogs);

        DailyMenuSelection selection = dailyMenuSelectionRepository.findByUserIdAndLogDate(user.getId(), date)
                .orElse(DailyMenuSelection.builder().user(user).logDate(date).build());
        selection.setMenu(menu);
        dailyMenuSelectionRepository.save(selection);

        return getDayDetail(date);
    }

    /** Thực đơn dùng để đối chiếu kế hoạch của 1 ngày: ưu tiên thực đơn user đã chọn riêng cho ngày đó. */
    private Menu resolveMenuForDate(User user, LocalDate date) {
        return dailyMenuSelectionRepository.findByUserIdAndLogDate(user.getId(), date)
                .map(DailyMenuSelection::getMenu)
                .orElseGet(() -> menuRepository.findFirstByUserIdAndIsDefaultFalseAndIsDeletedFalseOrderByCreatedAtDesc(user.getId())
                        .orElse(null));
    }

    private List<MealType> resolvePlannedSlots(Menu menu) {
        if (menu == null || menu.getMeals() == null || menu.getMeals().isEmpty()) {
            return List.of(SLOT_ORDER);
        }
        return List.of(SLOT_ORDER).stream()
                .filter(slot -> menu.getMeals().stream().anyMatch(m -> m.getMealType() == slot))
                .collect(Collectors.toList());
    }

    private String resolvePlannedDishName(Menu menu, MealType slot) {
        if (menu == null || menu.getMeals() == null) return null;
        return menu.getMeals().stream()
                .filter(m -> m.getMealType() == slot)
                .findFirst()
                .map(Meal::getMealDishes)
                .filter(dishes -> dishes != null && !dishes.isEmpty())
                .map(dishes -> dishes.stream()
                        .map(MealDish::getDish)
                        .filter(dish -> dish != null)
                        .map(Dish::getName)
                        .collect(Collectors.joining(" + ")))
                .filter(s -> !s.isBlank())
                .orElse(null);
    }

    /** Tổng hợp macro theo khoảng ngày (xem theo tuần/tháng). */
    public com.example.Fitness.DTO.response.Nutrition.FoodDiarySummaryResponse getSummary(
            LocalDate from, LocalDate to) {
        User user = getCurrentUser();
        LocalDate f = (from != null) ? from : LocalDate.now(VN_ZONE).minusDays(6);
        LocalDate t = (to != null) ? to : LocalDate.now(VN_ZONE);

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

    /**
     * So sánh 2 tên món (có thể là tổ hợp nhiều món nối bằng " + ") không phụ thuộc thứ tự —
     * vì Menu/Meal/MealDish là Set nên thứ tự nối chuỗi giữa lúc tạo menu và lúc resolve lại có thể khác nhau,
     * dẫn tới cùng 1 tổ hợp món bị so lệch thành "Đổi món" một cách sai lệch.
     */
    private boolean sameDishCombo(String a, String b) {
        if (a == null || b == null) return false;
        List<String> partsA = java.util.Arrays.stream(a.split("\\+"))
                .map(String::trim).map(String::toLowerCase).sorted().collect(Collectors.toList());
        List<String> partsB = java.util.Arrays.stream(b.split("\\+"))
                .map(String::trim).map(String::toLowerCase).sorted().collect(Collectors.toList());
        return partsA.equals(partsB);
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
