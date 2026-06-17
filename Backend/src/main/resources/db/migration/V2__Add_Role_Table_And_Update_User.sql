-- 1. Tạo bảng Role
CREATE TABLE `Role` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE, -- Ví dụ: 'ADMIN', 'USER'
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Thêm dữ liệu mặc định cho Role
INSERT INTO `Role` (`name`, `description`) VALUES ('USER', 'Người dùng thông thường');
INSERT INTO `Role` (`name`, `description`) VALUES ('ADMIN', 'Quản trị viên');

-- 3. Thêm cột role_id vào bảng User (Ban đầu để NULL để tránh lỗi nếu bảng User đã có dữ liệu)
ALTER TABLE `User` ADD COLUMN `role_id` BIGINT NULL;

-- 4. Cập nhật dữ liệu cũ: Gán tất cả User hiện tại thành quyền 'USER'
SET @default_role_id = (SELECT `id` FROM `Role` WHERE `name` = 'USER' LIMIT 1);
UPDATE `User` SET `role_id` = @default_role_id WHERE `role_id` IS NULL;

-- 5. Sau khi đã có dữ liệu, sửa cột role_id thành NOT NULL
ALTER TABLE `User` MODIFY COLUMN `role_id` BIGINT NOT NULL;

-- 6. Tạo khóa ngoại liên kết User -> Role
ALTER TABLE `User`
ADD CONSTRAINT `FK_User_Role`
FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`);