package com.example.Fitness.Controller;

import com.example.Fitness.DTO.request.UserDeviceTokenRequest;
import com.example.Fitness.DTO.response.common.ApiResponse;
import com.example.Fitness.DTO.response.common.Pagination;
import com.example.Fitness.DTO.response.errors.ErrorResponse;
import com.example.Fitness.DTO.response.errors.TError;
import com.example.Fitness.DTO.response.notification.NotificationResponse;
import com.example.Fitness.Exceptions.DataNotFoundException;
import com.example.Fitness.Model.User;
import com.example.Fitness.Service.FCMService;
import com.example.Fitness.Service.NotificationService;
import com.example.Fitness.Service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;
    private final FCMService fcmService;

    @PostMapping("/register-token")
    public ResponseEntity<?> registerToken(@RequestBody UserDeviceTokenRequest request) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            fcmService.registerDeviceToken(username, request);
            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(true)
                    .build());
        }
        catch (DataNotFoundException e) {
            TError error = TError.builder().code("NOT_FOUND").message(e.getMessage()).build();
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error(error).build());
        }
    }

    @GetMapping("/unread/count")
    public ResponseEntity<?> getNumberOfUnreadNoti() {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.getUserByUsername(username);
            Long count = notificationService.getNumberOfUnreadNoti(user.getId());
            return ResponseEntity.ok(ApiResponse.builder().status(true).data(count).build());
        }
        catch (DataNotFoundException e) {
            TError error = TError.builder().code("NOT_FOUND").message(e.getMessage()).build();
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error(error).build());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userService.getUserByUsername(username);

            Page<NotificationResponse> result = notificationService.getMyNotifications(user.getId(),
                    PageRequest.of(page,
                    limit));
            Pagination pageMeta = Pagination.builder()
                    .page(result.getNumber())
                    .pageSize(result.getSize())
                    .totalPages(result.getTotalPages())
                    .total(result.getTotalElements())
                    .hasMore(result.hasNext())
                    .build();
            return ResponseEntity.ok(ApiResponse.builder()
                    .status(true)
                    .data(result.getContent())
                    .meta(pageMeta)
                    .build());
        }
        catch (DataNotFoundException e) {
            TError error = TError.builder().code("NOT_FOUND").message(e.getMessage()).build();
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error(error).build());
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok(ApiResponse.builder().status(true).data(true).build());
        }
        catch (DataNotFoundException e) {
            TError error = TError.builder().code("NOT_FOUND").message(e.getMessage()).build();
            return ResponseEntity.badRequest().body(ErrorResponse.builder().error(error).build());
        }
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendTest(@RequestParam Long userId) {
        notificationService.createAndSendNotification(
                userId,
                "Test thông báo 🚀",
                "Đây là tin nhắn test lúc " + java.time.LocalTime.now(),
                "SYSTEM_TEST",
                null,
                "/my-workouts" // Link test
        );
        return ResponseEntity.ok("Đã gửi lệnh bắn thông báo!");
    }
}
