-- Thêm các cột mới vào bảng User
ALTER TABLE `User`
ADD COLUMN `date_of_birth` DATE NULL,
ADD COLUMN `activity_level` ENUM('SEDENTARY', 'LIGHTLY_ACTIVE', 'MODERATELY_ACTIVE', 'VERY_ACTIVE', 'EXTRA_ACTIVE') NULL ,
ADD COLUMN `fitness_goal` ENUM('LOSE_WEIGHT', 'GAIN_WEIGHT', 'MUSCLE_GAIN', 'SHAPE_BODY', 'OTHERS') NULL ;

-- 1. Thêm cột goal và difficulty vào WorkoutPlan để biết plan này dành cho ai
ALTER TABLE `WorkoutPlan`
ADD COLUMN `target_goal` ENUM('LOSE_WEIGHT', 'GAIN_WEIGHT', 'MUSCLE_GAIN', 'SHAPE_BODY', 'OTHERS') NULL,
ADD COLUMN `difficulty_level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NULL;

-- 2. Cho phép user_id được NULL (để tạo các Plan mẫu của hệ thống mà không thuộc về user cụ thể nào)
ALTER TABLE `WorkoutPlan` MODIFY COLUMN `user_id` BIGINT NULL;

-- 3. Tương tự với Menu (Thực đơn mẫu)
ALTER TABLE `Menu`
ADD COLUMN `target_goal` ENUM('LOSE_WEIGHT', 'GAIN_WEIGHT', 'MUSCLE_GAIN', 'SHAPE_BODY', 'OTHERS') NULL,
ADD COLUMN `calories_target` INT NULL;
ALTER TABLE `Menu` MODIFY COLUMN `user_id` BIGINT NULL;