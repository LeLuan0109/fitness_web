package com.example.DoanBE.Service;

import com.example.DoanBE.DTO.response.notification.NotificationResponse;
import com.example.DoanBE.Exceptions.DataNotFoundException;
import com.example.DoanBE.Mapper.NotificationMapper;
import com.example.DoanBE.Model.Notification;
import com.example.DoanBE.Model.User;
import com.example.DoanBE.Repository.NotificationRepository;
import com.example.DoanBE.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final FCMService fcmService;
    private final NotificationMapper notificationMapper;

    public Page<NotificationResponse> getMyNotifications(Long userId, Pageable pageable) {
        Page<Notification> notificationPage = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return notificationPage.map(notificationMapper::toNotificationResponse);
    }

    public Long getNumberOfUnreadNoti(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long notificationId) throws DataNotFoundException{
        Notification noti = notificationRepository.findById(notificationId).orElseThrow(() -> new DataNotFoundException(
                "Không tìm thấy thông báo với id = "+ notificationId));
        System.out.println(noti.toString());
        noti.setRead(true);
        notificationRepository.save(noti);
    }

    public void createAndSendNotification(Long userId, String title, String message, String type, Long refId, String link) {
        // 1. Tìm User
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;

        // 2. Lưu thông báo vào Database (Để hiển thị lịch sử)
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .content(message)
                .type(type)             // VD: "WORKOUT_REMINDER"
                .referenceId(refId)     // VD: planId (nếu có)
                .referenceUrl(link)     // VD: "/my-plans"
                .isRead(false)          // Mặc định chưa đọc
                .build();

        notificationRepository.save(notification);
        // 3. Gửi Push Notification qua Firebase
        String refIdStr = (refId != null) ? String.valueOf(refId) : "";
        fcmService.sendNotificationToUser(userId, title, message, link, type, refIdStr);
    }
}
