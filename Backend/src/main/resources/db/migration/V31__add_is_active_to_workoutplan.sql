-- Cho phép user đánh dấu 1 kế hoạch cá nhân là đang hoạt động (đang theo) hay đã bỏ,
-- để lịch tiến độ có thể phân biệt hiển thị (kế hoạch đã bỏ không tính vào tuân thủ, hiện màu khác).
ALTER TABLE `workoutplan` ADD COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT 1;
