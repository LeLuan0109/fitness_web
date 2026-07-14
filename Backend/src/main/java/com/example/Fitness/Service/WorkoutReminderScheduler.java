package com.example.Fitness.Service;

import com.example.Fitness.Repository.UserRepository;
import com.example.Fitness.Repository.WorkoutDayRepository;
import com.example.Fitness.Utils.NotificationMessages;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;

@Component
@RequiredArgsConstructor
@Slf4j
public class WorkoutReminderScheduler {
    private final NotificationService notificationService;
    private final WorkoutDayRepository workoutDayRepository;
    private final UserRepository userRepository;

    @Scheduled(cron = "0 0 7 * * ?")
    public void sendMorningWorkoutReminders() {
        LocalDate today = LocalDate.now();
        int dayOfWeekValue = today.getDayOfWeek().getValue();
        String dayName = today.getDayOfWeek().getDisplayName(TextStyle.FULL, new Locale("vi", "VN"));

        log.info("Bắt đầu quét lịch tập cho ngày: {} (Value: {})", dayName, dayOfWeekValue);

        List<Object[]> results = workoutDayRepository.findUserAndPlanIdsByDayOfWeek(dayOfWeekValue, today);

        int count = 0;
        for (Object[] row : results) {
            Long userId = (Long) row[0];
            Long planId = (Long) row[1];
            LocalDate startDate = (LocalDate) row[2];
            Integer durationWeek = (Integer) row[3];
            int weeks = (durationWeek != null) ? durationWeek : 4;

            // Ngày kết thúc = Ngày bắt đầu + số tuần (nhân 7 ngày)
            // Lưu ý: minusDays(1) vì ví dụ bắt đầu thứ 2 thì kết thúc vào chủ nhật tuần thứ 4
            LocalDate endDate = startDate.plusWeeks(weeks).minusDays(1);

            // Nếu hôm nay đã vượt quá ngày kết thúc -> BỎ QUA, không gửi thông báo
            if (today.isAfter(endDate)) {
                continue;
            }

            try {
                notificationService.createAndSendNotification(
                        userId,
                        "Đến giờ tập rồi! 💪",
                        "Hôm nay là " + dayName + ", bạn có lịch tập đang chờ. Chiến thôi!",
                        "WORKOUT_REMINDER",
                        planId,
                        "/workouts/" + planId
                );
                count++;
            } catch (Exception e) {
                log.error("Lỗi gửi thông báo cho user {}: {}", userId, e.getMessage());
            }
        }
        log.info("Đã gửi {} thông báo nhắc nhở hợp lệ.", count);
    }

    @Scheduled(cron = "0 0 20 * * ?") // 8 giờ tối hàng ngày
    public void sendEveningNudges() {
        LocalDate today = LocalDate.now();
        int dayOfWeek = today.getDayOfWeek().getValue();
        List<Object[]> lazyUsers = userRepository.findUsersMissedWorkout(dayOfWeek, today);
        log.info("Tìm thấy {} user cần nhắc nhở buổi tối.", lazyUsers.size());
        for (Object[] row : lazyUsers) {
            try {
                Long userId = (Long) row[0];
                int currentStreak = (row[1] != null) ? ((Number) row[1]).intValue() : 0;
                NotificationMessages.NotificationTemplate msg =
                        NotificationMessages.getRandomMessage(currentStreak);
                notificationService.createAndSendNotification(
                        userId,
                        msg.title,
                        msg.body,
                        "MISSED_WORKOUT",
                        null,
                        "/my-workouts"
                );
            } catch (Exception e) {
                log.error("Lỗi gửi notify tối: " + e.getMessage());
            }
        }
    }

    @Scheduled(cron = "1 0 0 * * ?")   //hạy lúc 00:00:01 mỗi ngày
    @Transactional
    public void resetStreaks() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        log.info("Bắt đầu quét reset streak cho ngày: {}", yesterday);
        userRepository.resetStreakForLazyUsers(yesterday);
        log.info("Đã reset streak các user không tập hôm qua.");
    }
}
