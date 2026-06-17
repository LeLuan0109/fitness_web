-- =============================================
-- 1. SEED DATA: NHÓM CƠ (MUSCLE GROUP)
-- Bảng: muscle_group
-- =============================================

INSERT INTO `musclegroup` (`name`, `created_at`, `updated_at`) VALUES
-- Thân trên
('Ngực (Chest)', NOW(), NOW()),
('Lưng / Xô (Back)', NOW(), NOW()),
('Vai (Shoulders)', NOW(), NOW()),
('Tay trước (Biceps)', NOW(), NOW()),
('Tay sau (Triceps)', NOW(), NOW()),
('Cẳng tay (Forearms)', NOW(), NOW()),
('Cầu vai (Traps)', NOW(), NOW()),

-- Thân dưới
('Đùi trước (Quadriceps)', NOW(), NOW()),
('Đùi sau (Hamstrings)', NOW(), NOW()),
('Mông (Glutes)', NOW(), NOW()),
('Bắp chân (Calves)', NOW(), NOW()),

-- Cơ lõi
('Cơ bụng (Abs)', NOW(), NOW()),
('Liên sườn (Obliques)', NOW(), NOW()),
('Toàn thân (Full Body)', NOW(), NOW());


-- =============================================
-- 2. SEED DATA: DỤNG CỤ TẬP (EQUIPMENT)
-- Bảng: equipment
-- =============================================

INSERT INTO `equipment` (`name`, `created_at`, `updated_at`) VALUES
('Trọng lượng cơ thể (Bodyweight)', NOW(), NOW()),

('Tạ đơn (Dumbbell)', NOW(), NOW()),
('Tạ đòn (Barbell)', NOW(), NOW()),
('Tạ ấm (Kettlebell)', NOW(), NOW()),
('Thanh tạ EZ (EZ Bar)', NOW(), NOW()),
('Bánh tạ (Weight Plate)', NOW(), NOW()),

('Máy tập (Machine)', NOW(), NOW()),
('Máy Smith', NOW(), NOW()),
('Dây cáp (Cable)', NOW(), NOW()),
('Máy chạy bộ (Treadmill)', NOW(), NOW()),
('Xe đạp tập (Exercise Bike)', NOW(), NOW()),
('Máy chèo thuyền (Rowing Machine)', NOW(), NOW()),

('Dây kháng lực (Resistance Band)', NOW(), NOW()),
('Xà đơn (Pull-up Bar)', NOW(), NOW()),
('Xà kép (Dip Bar)', NOW(), NOW()),
('Ghế tập (Bench)', NOW(), NOW()),
('Bóng thuốc (Medicine Ball)', NOW(), NOW()),
('Con lăn bụng (Ab Wheel)', NOW(), NOW()),
('Dây nhảy (Jump Rope)', NOW(), NOW()),
('Hộp nhảy (Plyo Box)', NOW(), NOW()),
('Bóng Yoga (Swiss Ball)', NOW(), NOW()),
('Dây treo kháng lực (TRX)', NOW(), NOW());


-- =============================================
-- 3. SEED DATA: LOẠI HÌNH TẬP (TRAINING TYPE)
-- Bảng: training_type
-- =============================================

INSERT INTO `trainingtype` (`name`, `created_at`, `updated_at`) VALUES
-- Phổ biến
('Tập sức mạnh (Strength)', NOW(), NOW()),
('Tăng cơ (Hypertrophy)', NOW(), NOW()),
('Tim mạch (Cardio)', NOW(), NOW()),
('Cường độ cao (HIIT)', NOW(), NOW()),

-- Cụ thể
('Cử tạ sức mạnh (Powerlifting)', NOW(), NOW()),
('Cử tạ Olympic (Weightlifting)', NOW(), NOW()),
('Calisthenics', NOW(), NOW()),
('Yoga', NOW(), NOW()),
('Pilates', NOW(), NOW()),
('Giãn cơ (Stretching)', NOW(), NOW()),
('Bài tập bật nhảy (Plyometrics)', NOW(), NOW()),
('CrossFit', NOW(), NOW()),
('Quyền anh (Boxing / Kickboxing)', NOW(), NOW()),
('Aerobic', NOW(), NOW());