package com.example.Fitness.Service;

import com.example.Fitness.DTO.request.PlanSearchRequest;
import com.example.Fitness.DTO.response.ChatResponse;
import com.example.Fitness.DTO.response.Nutrition.MenuListResponse;
import com.example.Fitness.DTO.response.SuggestionResponseDTO;
import com.example.Fitness.DTO.response.workout_plans.PlanResponse;
import com.example.Fitness.Enum.DifficultyLevel;
import com.example.Fitness.Enum.FitnessGoal;
import com.example.Fitness.Model.User;
import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Utils.HealthCalculatorUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.Fitness.Model.WorkoutLogs;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private final ChatClient.Builder chatClientBuilder;
    private final UserRepository userRepository;
    private final RecommendationService recommendationService;
    private final MenuService menuService;
    private final WorkoutPlantService workoutPlanService;
    private final com.example.Fitness.Repository.WorkoutLogRepository workoutLogRepository;
    private final com.example.Fitness.Repository.RNutrition.FoodLogRepository foodLogRepository;

    @Value("classpath:prompts/fitness-advisor.st")
    private Resource promptTemplateResource;

    @Value("classpath:prompts/fitness-analysis.st")
    private Resource analysisTemplateResource;

    @Value("classpath:prompts/app-manual.txt")
    private Resource appManualResource;

    private static final Pattern MENU_PATTERN = Pattern.compile("\\[ACTION: SEARCH_MENU goal=\"([^\"]+)\" cal=\"([^\"]+)\"\\]");
    private static final Pattern PLAN_PATTERN = Pattern.compile("\\[ACTION: SEARCH_PLAN goal=\"([^\"]+)\" level=\"([^\"]+)\"\\]");

    public ChatResponse chat(Long userId, String userMessage) {
        try {
            String manualContent = loadResource(appManualResource);
            String userContext = buildUserContext(userId);

            ChatClient chatClient = chatClientBuilder.build();
            PromptTemplate template = new PromptTemplate(promptTemplateResource);
            Prompt prompt = template.create(Map.of(
                    "application_manual", manualContent,
                    "user_context", userContext,
                    "user_message", userMessage
            ));

            String rawResponse = chatClient.prompt(prompt).call().content();
            return processResponseWithAction(rawResponse, userId);

        } catch (Exception e) {
            log.error("Chatbot Error: ", e);
            return ChatResponse.builder().message("Hệ thống đang bận, vui lòng thử lại sau.").build();
        }
    }

    // ===== Phân tích tập luyện bằng AI (prompt có sẵn + số liệu thực tế) =====

    /**
     * Gom số liệu tập luyện/dinh dưỡng thực tế của user, đưa vào prompt phân tích và gửi Gemini.
     * @param type PROGRESS | NUTRITION | OVERALL
     */
    public ChatResponse analyzeTraining(Long userId, String type) {
        try {
            String stats = buildTrainingStats(userId);
            String focus = focusByType(type);

            ChatClient chatClient = chatClientBuilder.build();
            PromptTemplate template = new PromptTemplate(analysisTemplateResource);
            Prompt prompt = template.create(Map.of("focus", focus, "stats", stats));

            String content = chatClient.prompt(prompt).call().content();
            return ChatResponse.builder().message(content).build();
        } catch (Exception e) {
            log.error("Analyze Error: ", e);
            return ChatResponse.builder().message("Hệ thống đang bận, vui lòng thử lại sau.").build();
        }
    }

    private String focusByType(String type) {
        if (type == null) return "Đánh giá tổng quan tập luyện và dinh dưỡng gần đây.";
        switch (type.toUpperCase()) {
            case "PROGRESS":
                return "Phân tích tiến bộ sức mạnh và kỷ lục (PR) của người dùng: bài nào tiến bộ, bài nào chững, gợi ý tăng tiến.";
            case "NUTRITION":
                return "Phân tích dinh dưỡng hôm nay so với mục tiêu (calo & macro): thừa/thiếu gì, nên điều chỉnh ra sao.";
            default:
                return "Đánh giá tổng quan cả tập luyện lẫn dinh dưỡng gần đây, độ đều đặn (streak) và đưa lời khuyên cho tuần tới.";
        }
    }

    /** Xây chuỗi số liệu thực tế từ DB (không bịa). */
    private String buildTrainingStats(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return "Không có dữ liệu người dùng.";

        StringBuilder sb = new StringBuilder();
        sb.append("HỒ SƠ:\n");
        sb.append(String.format("- Tên: %s\n", user.getName() != null ? user.getName() : "Bạn"));
        try {
            if (user.checkOnboardingStatus()) {
                SuggestionResponseDTO st = recommendationService.getRecommendation(userId);
                sb.append(String.format("- Tuổi: %d | BMI: %.1f | TDEE: %.0f kcal/ngày | Mục tiêu: %s\n",
                        HealthCalculatorUtils.calculateAge(user.getDateOfBirth()), st.getBmi(), st.getTdee(),
                        translateFitnessGoal(user.getFitnessGoal())));
            } else {
                sb.append("- Chưa cập nhật chỉ số cơ thể.\n");
            }
        } catch (Exception e) {
            sb.append("- Chỉ số cơ thể: chưa đầy đủ.\n");
        }

        Integer cur = user.getCurrentStreak();
        Integer lng = user.getLongestStreak();
        sb.append(String.format("- Chuỗi ngày tập hiện tại: %d ngày (dài nhất: %d ngày)\n",
                cur != null ? cur : 0, lng != null ? lng : 0));

        Integer totalWorkouts = workoutLogRepository.countTotalWorkoutsByUserId(userId);
        Double totalCal = workoutLogRepository.sumTotalCaloriesByUserId(userId);
        Integer totalDur = workoutLogRepository.sumTotalDurationByUserId(userId);
        sb.append("\nTẬP LUYỆN (tổng):\n");
        sb.append(String.format("- Số buổi đã tập: %d | Tổng calo đốt: %.0f kcal | Tổng thời gian: %d phút\n",
                totalWorkouts != null ? totalWorkouts : 0,
                totalCal != null ? totalCal : 0,
                totalDur != null ? totalDur / 60 : 0));

        LocalDateTime now = LocalDateTime.now();
        List<WorkoutLogs> recent = workoutLogRepository.searchLogs(userId, now.minusDays(7), now, null);
        double calWeek = recent.stream().mapToDouble(l -> l.getCaloriesBurned() != null ? l.getCaloriesBurned() : 0).sum();
        long daysWeek = recent.stream()
                .filter(l -> l.getCreatedAt() != null)
                .map(l -> l.getCreatedAt().toLocalDate()).distinct().count();
        sb.append(String.format("- 7 ngày qua: tập %d ngày, đốt %.0f kcal\n", daysWeek, calWeek));

        sb.append("\nKỶ LỤC (PR) THEO BÀI:\n");
        List<Object[]> exs = workoutLogRepository.findLoggedExercisesByUser(userId);
        if (exs.isEmpty()) sb.append("- Chưa có dữ liệu bài tập.\n");
        for (Object[] ex : exs) {
            Long exId = ((Number) ex[0]).longValue();
            String exName = String.valueOf(ex[1]);
            List<Object[]> rows = workoutLogRepository.getExerciseProgress(userId, exId, null, null);
            double bestW = 0, bestRm = 0;
            for (Object[] r : rows) {
                bestW = Math.max(bestW, num(r[1]));
                bestRm = Math.max(bestRm, num(r[3]));
            }
            sb.append(String.format("- %s: tạ nặng nhất %.0f kg, 1RM ước tính %.0f kg\n", exName, bestW, bestRm));
        }

        LocalDate today = LocalDate.now();
        List<Object[]> food = foodLogRepository.sumMacrosByDateRange(userId, today, today);
        sb.append("\nDINH DƯỠNG HÔM NAY:\n");
        if (food.isEmpty()) {
            sb.append("- Chưa ghi món nào hôm nay.\n");
        } else {
            Object[] f = food.get(0);
            sb.append(String.format("- Calo: %.0f kcal | Đạm: %.0f g | Tinh bột: %.0f g | Béo: %.0f g\n",
                    num(f[1]), num(f[2]), num(f[3]), num(f[4])));
        }
        return sb.toString();
    }

    private double num(Object o) {
        return o != null ? ((Number) o).doubleValue() : 0;
    }

    private ChatResponse processResponseWithAction(String rawResponse, Long userId) {
        String cleanMessage = rawResponse;
        String actionType = null;
        List<?> data = Collections.emptyList();

        Matcher menuMatcher = MENU_PATTERN.matcher(rawResponse);
        if (menuMatcher.find()) {
            cleanMessage = rawResponse.replace(menuMatcher.group(0), "").trim();
            actionType = "MENU_LIST";
            data = findBestMenus(parseGoal(menuMatcher.group(1)), parseFloat(menuMatcher.group(2)), userId);
        }

        Matcher planMatcher = PLAN_PATTERN.matcher(rawResponse);
        if (planMatcher.find()) {
            cleanMessage = rawResponse.replace(planMatcher.group(0), "").trim();
            actionType = "PLAN_LIST";
            data = findBestPlans(parseGoal(planMatcher.group(1)), parseLevel(planMatcher.group(2)), userId);
        }

        return ChatResponse.builder()
                .message(cleanMessage)
                .actionType(actionType)
                .data(data)
                .build();
    }

    private List<MenuListResponse> findBestMenus(FitnessGoal requestGoal, Float targetCal, Long userId) {
        FitnessGoal finalGoal = requestGoal;
        if (finalGoal == null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) finalGoal = user.getFitnessGoal();
        }

        Pageable pageable = PageRequest.of(0, 5, Sort.by("calories").ascending());
        Page<MenuListResponse> result;
//logic tim kiem
        if (targetCal != null && finalGoal != null) {
            float min = targetCal - 300;
            float max = targetCal + 300;
            result = menuService.getPublicMenus(null, finalGoal, min, max, null, null, null, null, null, null, pageable);
            if (result.hasContent()) return result.getContent();
        }

        if (finalGoal != null) {
            result = menuService.getPublicMenus(null, finalGoal, null, null, null, null, null, null, null, null, pageable);
            if (result.hasContent()) return result.getContent();
        }

        return menuService.getPublicMenus(null, null, null, null, null, null, null, null, null, null, pageable).getContent();
    }

    private List<PlanResponse> findBestPlans(FitnessGoal requestGoal, DifficultyLevel requestLevel, Long userId) {
        FitnessGoal finalGoal = requestGoal;
        DifficultyLevel finalLevel = requestLevel;

        if (finalGoal == null || finalLevel == null) {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                if (finalGoal == null) finalGoal = user.getFitnessGoal();
                if (finalLevel == null) finalLevel = DifficultyLevel.BEGINNER;
            }
        }

        PlanSearchRequest req = new PlanSearchRequest();
        req.setPage(0);
        req.setLimit(5);
        req.setGoal(finalGoal);
        req.setLevel(finalLevel);

        Page<PlanResponse> result = workoutPlanService.getSamplePlans(req);
        if (result.hasContent()) return result.getContent();

        req.setLevel(null);
        result = workoutPlanService.getSamplePlans(req);
        if (result.hasContent()) return result.getContent();

        req.setGoal(null);
        req.setLevel(finalLevel);
        result = workoutPlanService.getSamplePlans(req);

        return result.getContent();
    }

    private FitnessGoal parseGoal(String str) {
        if (str == null || "null".equals(str)) return null;
        try { return FitnessGoal.valueOf(str); } catch (Exception e) { return null; }
    }

    private DifficultyLevel parseLevel(String str) {
        if (str == null || "null".equals(str)) return null;
        try { return DifficultyLevel.valueOf(str); } catch (Exception e) { return null; }
    }

    private Float parseFloat(String str) {
        if (str == null || "null".equals(str)) return null;
        try { return Float.parseFloat(str); } catch (Exception e) { return null; }
    }

    private String buildUserContext(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return "Trạng thái: Khách vãng lai (Chưa đăng nhập).";

        StringBuilder sb = new StringBuilder();
        sb.append(String.format("- Tên: %s\n", (user.getName() != null ? user.getName() : "Bạn")));

        try {
            if (user.checkOnboardingStatus()) {
                SuggestionResponseDTO stats = recommendationService.getRecommendation(userId);
                sb.append(String.format("- Tuổi: %d\n", HealthCalculatorUtils.calculateAge(user.getDateOfBirth())));
                sb.append(String.format("- BMI: %.2f\n", stats.getBmi()));
                sb.append(String.format("- TDEE: %.0f calo/ngày\n", stats.getTdee()));
                sb.append(String.format("- Mục tiêu: %s\n", translateFitnessGoal(user.getFitnessGoal())));
            } else {
                sb.append("- Trạng thái: Chưa cập nhật chỉ số cơ thể.\n");
            }
        } catch (Exception e) {
            sb.append("- Dữ liệu sức khỏe: Chưa đầy đủ.\n");
        }
        return sb.toString();
    }

    private String translateFitnessGoal(FitnessGoal goal) {
        if (goal == null) return "Chưa xác định";
        switch (goal) {
            case LOSE_WEIGHT: return "Giảm cân";
            case GAIN_WEIGHT: return "Tăng cân";
            case MUSCLE_GAIN: return "Tăng cơ";
            case SHAPE_BODY: return "Giữ dáng";
            default: return goal.name();
        }
    }

    private String loadResource(Resource resource) {
        try {
            return new String(resource.getInputStream().readAllBytes());
        } catch (Exception e) {
            log.error("Lỗi đọc resource", e);
            return "";
        }
    }
}