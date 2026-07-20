package com.example.Fitness.Controller;

import com.example.Fitness.DTO.request.ChatRequest;
import com.example.Fitness.DTO.response.ChatResponse; // Import DTO mới
import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.Service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatbotService chatbotService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> chat(@PathVariable Long userId, @RequestBody ChatRequest request) {
        String message = request.getMessage();

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.builder().status(false).data("Tin nhắn không được để trống!").build()
            );
        }

        ChatResponse response = chatbotService.chat(userId, message);

        return ResponseEntity.ok(ApiResponse.<ChatResponse>builder()
                .status(true)
                .data(response)
                .build());
    }

    /**
     * Phân tích số liệu tập luyện/dinh dưỡng bằng AI (Gemini) từ prompt có sẵn.
     * type: PROGRESS | NUTRITION | OVERALL
     */
    @PostMapping("/{userId}/analyze")
    public ResponseEntity<?> analyze(@PathVariable Long userId, @RequestBody(required = false) ChatRequest request) {
        String type = (request != null && request.getMessage() != null) ? request.getMessage() : "OVERALL";
        ChatResponse response = chatbotService.analyzeTraining(userId, type);
        return ResponseEntity.ok(ApiResponse.<ChatResponse>builder()
                .status(true)
                .data(response)
                .build());
    }
}