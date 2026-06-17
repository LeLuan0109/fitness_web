package com.example.DoanBE.Utils;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

public class NotificationMessages {
    private static final List<NotificationTemplate> TEMPLATES = Arrays.asList(
            // Nhóm Dụ dỗ
            new NotificationTemplate("Chỉ 15 phút thôi mà! ⏰", "Nhanh hơn cả thời gian bạn lướt TikTok. Vào tập ngay đi!"),
            new NotificationTemplate("Đừng suy nghĩ nữa 👟", "Phần khó nhất là xỏ giày vào. Phần còn lại để app lo!"),

            // Nhóm FOMO
            new NotificationTemplate("BÁO ĐỘNG ĐỎ! 🚨", "Chuỗi {streak} ngày của bạn sắp 'bay màu'. Cứu lấy nó ngay!"),
            new NotificationTemplate("Ngọn lửa sắp tắt rồi... 🔥", "Bạn đã giữ lửa {streak} ngày. Đừng để nó tắt!"),

            // Nhóm Dỗi hờn
            new NotificationTemplate("Hôm nay bạn bận lắm sao? 🥺", "Bận đến mức không dành nổi 10 phút cho bản thân ư?"),
            new NotificationTemplate("Tôi buồn đấy... 😢", "Tôi đã đợi bạn cả ngày. Đừng để tôi leo cây chứ?"),

            // Nhóm Thách thức
            new NotificationTemplate("Đừng là người bỏ cuộc! 💪", "Chứng minh cho bản thân thấy bạn mạnh mẽ hơn sự lười biếng.")
    );

    public static NotificationTemplate getRandomMessage(int currentStreak) {
        Random rand = new Random();
        NotificationTemplate template = TEMPLATES.get(rand.nextInt(TEMPLATES.size()));

        String title = template.title.replace("{streak}", String.valueOf(currentStreak));
        String body = template.body.replace("{streak}", String.valueOf(currentStreak));

        if (currentStreak == 0 && (title.contains("0 ngày") || body.contains("0 ngày"))) {
            return new NotificationTemplate("Bắt đầu hành trình mới! 🚀", "Hôm nay là ngày tuyệt vời để bắt đầu chuỗi tập luyện đầu tiên.");
        }

        return new NotificationTemplate(title, body);
    }

    // Helper class
    public static class NotificationTemplate {
        public String title;
        public String body;

        public NotificationTemplate(String title, String body) {
            this.title = title;
            this.body = body;
        }
    }
}
