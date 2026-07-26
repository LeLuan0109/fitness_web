-- =============================================
-- V32: Chọn thực đơn theo ngày (áp dụng menu -> tự ghi 4 bữa) + cấu hình giờ nhắc nhật ký ăn
-- =============================================

-- 1) daily_menu_selection: ghi nhớ user đã chọn thực đơn nào cho ngày nào
--    (dùng để đối chiếu "đúng kế hoạch" thay vì đoán menu tạo gần nhất)
CREATE TABLE `daily_menu_selection` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `log_date` DATE NOT NULL,
    `menu_id` BIGINT NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_daily_menu_selection_user_date` (`user_id`, `log_date`),
    CONSTRAINT `fk_daily_menu_selection_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
    CONSTRAINT `fk_daily_menu_selection_menu` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`id`)
);

-- 2) reminder_config: cấu hình giờ nhắc nhật ký ăn (1 dòng duy nhất, admin chỉnh được)
CREATE TABLE `reminder_config` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `reminder_key` VARCHAR(50) NOT NULL COMMENT 'VD: FOOD_LOG_REMINDER',
    `reminder_time` TIME NOT NULL COMMENT 'Giờ nhắc trong ngày (HH:mm)',
    `enabled` TINYINT(1) NOT NULL DEFAULT 1,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_reminder_config_key` (`reminder_key`)
);

INSERT INTO `reminder_config` (`reminder_key`, `reminder_time`, `enabled`)
VALUES ('FOOD_LOG_REMINDER', '20:30:00', 1);
