package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.request.PlanSearchRequest;
import com.example.DoanBE.DTO.response.ChatResponse;
import com.example.DoanBE.DTO.response.Nutrition.MenuListResponse;
import com.example.DoanBE.DTO.response.SuggestionResponseDTO;
import com.example.DoanBE.DTO.response.workout_plans.PlanResponse;
import com.example.DoanBE.Enum.DifficultyLevel;
import com.example.DoanBE.Enum.FitnessGoal;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.UserRepository;
import com.example.DoanBE.Utils.HealthCalculatorUtils;
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

    @Value("classpath:prompts/fitness-advisor.st")
    private Resource promptTemplateResource;

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