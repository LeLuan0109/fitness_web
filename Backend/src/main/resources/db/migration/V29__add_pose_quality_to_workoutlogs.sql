-- V29: Thêm cột lưu chất lượng nhận diện tư thế camera AI cho mỗi set đã ghi log.
-- Giá trị: "OK" (đa số khung hình đúng hướng), "UNCERTAIN_ORIENTATION" (đa số sai hướng camera),
-- NULL (không xác định được, VD ghi tay thủ công hoặc camera không nhận diện được landmark nào).
-- Đây chỉ là CẢNH BÁO/GHI NHẬN — không chặn việc ghi log, nghiệp vụ dùng giá trị này sẽ bổ sung sau.
ALTER TABLE `workoutlogs` ADD COLUMN `pose_quality` VARCHAR(30) NULL AFTER `calories_burned`;
