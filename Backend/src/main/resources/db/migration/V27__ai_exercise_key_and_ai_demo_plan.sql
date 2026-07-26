-- =============================================
-- V27: Thêm "key" nhận diện AI cho bài tập (thay vì so tên chuỗi tự do)
--      + bổ sung 4 bài tập còn thiếu trong 14 bài AI hỗ trợ
--      + thêm 1 kế hoạch mẫu dùng đủ 14 bài (để test/demo camera AI)
-- =============================================

-- ---------- 1. Cột key nhận diện AI ----------
ALTER TABLE `exercises` ADD COLUMN `ai_exercise_key` VARCHAR(30) NULL AFTER `level`;

-- ---------- 2. Gắn key cho các bài tập ĐÃ CÓ SẴN khớp 1 trong 14 loại ----------
UPDATE `exercises` SET `ai_exercise_key` = 'SQUAT'         WHERE `name` IN ('Squat tạ đòn','Front Squat');
UPDATE `exercises` SET `ai_exercise_key` = 'PUSHUP'        WHERE `name` = 'Hít đất (Push-up)';
UPDATE `exercises` SET `ai_exercise_key` = 'DEADLIFT'      WHERE `name` = 'Deadlift';
UPDATE `exercises` SET `ai_exercise_key` = 'LUNGE'         WHERE `name` = 'Lunge';
UPDATE `exercises` SET `ai_exercise_key` = 'PLANK'         WHERE `name` = 'Plank';
UPDATE `exercises` SET `ai_exercise_key` = 'PULLUP'        WHERE `name` IN ('Hít xà (Pull-up)','Hít xà rộng');
UPDATE `exercises` SET `ai_exercise_key` = 'BICEPS_CURL'   WHERE `name` IN ('Cuốn tạ tay trước (Bicep Curl)','Cuốn tạ búa (Hammer Curl)');
UPDATE `exercises` SET `ai_exercise_key` = 'OVERHEAD_PRESS' WHERE `name` IN ('Đẩy vai tạ đơn','Đẩy vai tạ đòn (Overhead Press)');
UPDATE `exercises` SET `ai_exercise_key` = 'JUMPING_JACK'  WHERE `name` = 'Nhảy Jumping Jack';
UPDATE `exercises` SET `ai_exercise_key` = 'CALF_RAISE'    WHERE `name` = 'Nhón bắp chân (Calf Raise)';

-- ---------- 3. Thêm 4 bài tập còn thiếu (Sit-up, Back Lever, Glute Bridge, Lateral Raise) ----------
INSERT INTO `exercises` (`name`,`description`,`training_type`,`level`,`ai_exercise_key`,`is_deleted`,`met`,`created_at`,`updated_at`) VALUES
('Gập bụng nằm (Sit-up)','Nằm gập thân trên chạm gối, cơ bụng',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER','SITUP',0,4.0,NOW(),NOW()),
('Back Lever','Treo xà giữ thân ngang, cơ lưng & core nâng cao',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'ADVANCED','BACK_LEVER',0,6.0,NOW(),NOW()),
('Cầu mông (Glute Bridge)','Nằm ngửa nâng hông, cơ mông & đùi sau',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER','GLUTE_BRIDGE',0,3.0,NOW(),NOW()),
('Nâng tạ vai ngang (Lateral Raise)','Nâng tạ đơn sang ngang, cơ vai',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'BEGINNER','LATERAL_RAISE',0,3.0,NOW(),NOW());

INSERT INTO `exercise_muscle_group` (`exercise_id`,`muscle_group_id`,`is_primary`,`created_at`,`updated_at`) VALUES
((SELECT id FROM exercises WHERE name='Gập bụng nằm (Sit-up)'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Back Lever'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Back Lever'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Cầu mông (Glute Bridge)'),(SELECT id FROM musclegroup WHERE name='Mông (Glutes)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Cầu mông (Glute Bridge)'),(SELECT id FROM musclegroup WHERE name='Đùi sau (Hamstrings)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Nâng tạ vai ngang (Lateral Raise)'),(SELECT id FROM musclegroup WHERE name='Vai (Shoulders)'),1,NOW(),NOW());

INSERT INTO `exercise_equipment` (`exercise_id`,`equipment_id`) VALUES
((SELECT id FROM exercises WHERE name='Gập bụng nằm (Sit-up)'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Back Lever'),(SELECT id FROM equipment WHERE name='Xà đơn (Pull-up Bar)')),
((SELECT id FROM exercises WHERE name='Cầu mông (Glute Bridge)'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Nâng tạ vai ngang (Lateral Raise)'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)'));

-- ---------- 4. Kế hoạch mẫu demo đủ 14 bài AI hỗ trợ ----------
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Toàn thân với AI Camera','3 buổi/tuần, dùng camera AI đếm rep tự động cho toàn bộ bài tập',1,3,4,NULL,'SHAPE_BODY','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();

-- Buổi 1 (Thứ 2): Squat, Lunge, Glute Bridge, Push-up, Plank
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat tạ đòn'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Cầu mông (Glute Bridge)'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Hít đất (Push-up)'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),3,NULL,NULL,30,NOW(),NOW());

-- Buổi 2 (Thứ 4): Pull-up, Biceps Curl, Overhead Press, Lateral Raise, Sit-up
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Hít xà (Pull-up)'),3,8,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Cuốn tạ tay trước (Bicep Curl)'),3,12,10.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy vai tạ đơn'),3,12,10.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Nâng tạ vai ngang (Lateral Raise)'),3,12,5.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Gập bụng nằm (Sit-up)'),3,15,NULL,NULL,NOW(),NOW());

-- Buổi 3 (Thứ 6): Deadlift, Jumping Jack, Calf Raise, Back Lever
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,6,3,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),3,10,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Nhảy Jumping Jack'),3,20,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Nhón bắp chân (Calf Raise)'),3,20,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Back Lever'),3,NULL,NULL,15,NOW(),NOW());
