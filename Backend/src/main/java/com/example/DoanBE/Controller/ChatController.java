package com.example.DoanBE.Controller;

import com.example.DoanBE.DTO.request.ChatRequest;
import com.example.DoanBE.DTO.response.ChatResponse; // Import DTO mới
import com.example.DoanBE.DTO.response.common.ApiResponse;
import com.example.DoanBE.Service.ChatbotService;
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
}