-- =============================================
-- V23: Mở rộng thông tin onboarding phục vụ Recommendation
-- Thêm 3 trường (nullable để không phá dữ liệu cũ):
--   - experience_level: kinh nghiệm tập (suy độ khó chính xác hơn PAL)
--   - days_per_week_available: số buổi rảnh/tuần (khớp lịch kế hoạch)
--   - target_weight: cân nặng mục tiêu (tính tốc độ, cảnh báo ép cân)
-- =============================================

ALTER TABLE `user`
    ADD COLUMN `experience_level` VARCHAR(20) DEFAULT NULL COMMENT 'NEW | INTERMEDIATE | EXPERT',
    ADD COLUMN `days_per_week_available` INT DEFAULT NULL COMMENT 'Số buổi rảnh tập trong tuần',
    ADD COLUMN `target_weight` DOUBLE DEFAULT NULL COMMENT 'Cân nặng mục tiêu (kg)';
