-- Thêm cột exercise_id và set_number vào bảng workout_log
ALTER TABLE `workoutlogs`
ADD COLUMN `exercise_id` BIGINT NOT NULL,
ADD COLUMN `set_number` INT NOT NULL DEFAULT 1,
ADD CONSTRAINT `fk_workout_log_exercise`
FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`);

ALTER TABLE `workoutday_exercises`
MODIFY COLUMN `weight` DOUBLE NULL;

ALTER TABLE `workoutlogs`
MODIFY COLUMN `actual_weights` DOUBLE NULL;

ALTER TABLE `exercises`
ADD COLUMN `met` FLOAT DEFAULT 3.5 COMMENT 'Hệ số trao đổi chất (Metabolic Equivalent)';