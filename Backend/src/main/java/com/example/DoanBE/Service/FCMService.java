package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.request.UserDeviceTokenRequest;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Model.UserDeviceToken;
import com.example.DoanBE.Repository.UserDeviceTokenRepository;
import com.example.DoanBE.Repository.UserRepository;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FCMService {

    private final UserDeviceTokenRepository tokenRepository;
    private final UserRepository userRepository;

    public void registerDeviceToken(String username, UserDeviceTokenRequest request) throws DataNotFoundException{
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng với username: " + username));

        Optional<UserDeviceToken> existingToken = tokenRepository.findByToken(request.getToken());

        if (existingToken.isPresent()) {
            UserDeviceToken token = existingToken.get();

            // Nếu token này trước đây của user khác (ví dụ: A đăng xuất, B đăng nhập trên cùng máy)
            // Thì cập nhật lại chủ sở hữu mới là B
            if (!token.getUser().getId().equals(user.getId())) {
                token.setUser(user);
                tokenRepository.save(token);
            }
        } else {
            UserDeviceToken newToken = UserDeviceToken.builder()
                    .token(request.getToken())
                    .user(user)
                    .deviceType(request.getDeviceType())
                    .build();
            tokenRepository.save(newToken);
        }
    }

    public void sendNotificationToUser(Long userId, String title, String body, String link, String type, String referenceId) {
        List<String> tokens = tokenRepository.findByUserId(userId).stream()
                .map(UserDeviceToken::getToken)
                .collect(Collectors.toList());

        if (tokens.isEmpty()) return;

        // 1. Tạo Notification (Phần hiển thị trên thanh thông báo)
        Notification notification = Notification.builder()
                .setTitle(title)
                .setBody(body)
                .build();

        // 2. Tạo Data Payload (Dữ liệu ẩn để Web/App xử lý logic click)
        MulticastMessage.Builder messageBuilder = MulticastMessage.builder()
                .setNotification(notification)
                .putData("click_action", "APP_NOTIFICATION_CLICK")
                .putData("title", title)
                .putData("body", body)
                .putData("link", link != null ? link : "")   // Dành cho Web
                .putData("type", type != null ? type : "")   // Dành cho App router (VD: WORKOUT_REMINDER)
                .putData("id", referenceId != null ? referenceId : "") // ID đối tượng (VD: planId)
                .addAllTokens(tokens);

        try {
            BatchResponse response = FirebaseMessaging.getInstance().sendEachForMulticast(messageBuilder.build());
            log.info("Đã gửi {} tin nhắn tới user {}", response.getSuccessCount(), userId);

            if (response.getFailureCount() > 0) {
                deleteInvalidTokens(response, tokens);
            }
        } catch (FirebaseMessagingException e) {
            log.error("Lỗi gửi FCM: ", e);
        }
    }

    private void deleteInvalidTokens(BatchResponse response, List<String> tokens) {
        List<String> failedTokens = new ArrayList<>();
        List<SendResponse> responses = response.getResponses();
        for (int i = 0; i < responses.size(); i++) {
            SendResponse sendResponse = responses.get(i);
            if (!sendResponse.isSuccessful()) {
                FirebaseMessagingException exception = sendResponse.getException();
                MessagingErrorCode errorCode = exception.getMessagingErrorCode();
                if (errorCode == MessagingErrorCode.UNREGISTERED ||
                        errorCode == MessagingErrorCode.INVALID_ARGUMENT ||
                        errorCode == MessagingErrorCode.SENDER_ID_MISMATCH) {
                    failedTokens.add(tokens.get(i));
                    log.warn("Token không hợp lệ (Lỗi: {}): {}", errorCode, tokens.get(i));
                }
            }
        }
        if (!failedTokens.isEmpty()) {
            tokenRepository.deleteByTokenIn(failedTokens);
        }
    }
}
