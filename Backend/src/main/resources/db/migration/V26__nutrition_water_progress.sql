-- =============================================
-- V26: Nhật ký ăn linh hoạt + nước uống + tuân thủ thực đơn + theo dõi cân nặng
-- =============================================

-- 1) food_log: cho phép món tự nhập (dish_id null) + ghi đè calo/macro thực tế
ALTER TABLE `food_log` MODIFY COLUMN `dish_id` BIGINT NULL;
ALTER TABLE `food_log`
    ADD COLUMN `custom_name` VARCHAR(255) DEFAULT NULL COMMENT 'Tên món tự nhập (khi không thuộc catalog)',
    ADD COLUMN `actual_calories` FLOAT DEFAULT NULL COMMENT 'Calo thực tế (ghi đè dish×quantity)',
    ADD COLUMN `actual_protein` FLOAT DEFAULT NULL,
    ADD COLUMN `actual_carbs` FLOAT DEFAULT NULL,
    ADD COLUMN `actual_fat` FLOAT DEFAULT NULL;

-- 2) daily_checkin: nước uống + tuân thủ thực đơn (Có/Không) theo ngày
CREATE TABLE `daily_checkin` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `log_date` DATE NOT NULL,
    `water_ml` INT DEFAULT 0 COMMENT 'Lượng nước uống trong ngày (ml)',
    `followed_menu` TINYINT(1) DEFAULT NULL COMMENT 'Hôm nay ăn đúng khẩu phần thực đơn? 1=Có 0=Không',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_daily_checkin_user_date` (`user_id`, `log_date`),
    CONSTRAINT `fk_daily_checkin_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

-- 3) weight_log: theo dõi cân nặng theo thời gian
CREATE TABLE `weight_log` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `weight` DOUBLE NOT NULL COMMENT 'Cân nặng (kg)',
    `log_date` DATE NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_weight_log_user_date` (`user_id`, `log_date`),
    CONSTRAINT `fk_weight_log_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);
