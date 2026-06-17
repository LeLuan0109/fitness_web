-- FILE V10 ĐÃ SỬA: Chỉ thêm những cột chưa có trong V1

-- 1. Thêm các cột thông tin cho Menu (V1 chưa có các cột này)
ALTER TABLE `Menu` ADD COLUMN `is_private` BOOLEAN DEFAULT TRUE;
ALTER TABLE `Menu` ADD COLUMN `description` VARCHAR(500) NULL;
ALTER TABLE `Menu` ADD COLUMN `image` VARCHAR(255) NULL;
ALTER TABLE `Menu` ADD COLUMN `fitness_goal` VARCHAR(50) NULL;

-- 2. Thêm các cột tổng dinh dưỡng cho Menu
ALTER TABLE `Menu` ADD COLUMN `calories` FLOAT DEFAULT 0;
ALTER TABLE `Menu` ADD COLUMN `protein` FLOAT DEFAULT 0;
ALTER TABLE `Menu` ADD COLUMN `carbs` FLOAT DEFAULT 0;
ALTER TABLE `Menu` ADD COLUMN `fat` FLOAT DEFAULT 0;
ALTER TABLE menu ADD COLUMN display_order INT DEFAULT 1;

-- 3. Thêm liên kết Meal -> Menu (V1 chưa có)
ALTER TABLE `Meal` ADD COLUMN `menu_id` BIGINT NULL;

ALTER TABLE `Meal` 
ADD CONSTRAINT `FK_Meal_Menu` 
FOREIGN KEY (`menu_id`) REFERENCES `Menu`(`id`) ON DELETE CASCADE;

ALTER TABLE Meal
ADD COLUMN calories FLOAT DEFAULT 0,
ADD COLUMN protein FLOAT DEFAULT 0,
ADD COLUMN carbs FLOAT DEFAULT 0,
ADD COLUMN fat FLOAT DEFAULT 0,
ADD COLUMN meal_type VARCHAR(50);

ALTER TABLE Dishes_Meal
ADD COLUMN quantity INT DEFAULT 1,
ADD COLUMN total_calories FLOAT DEFAULT 0;
