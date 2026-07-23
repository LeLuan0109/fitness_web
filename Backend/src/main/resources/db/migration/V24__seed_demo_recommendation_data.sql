-- =============================================
-- V24: SEED DATA DEMO cho Recommendation
-- Bài tập + Kế hoạch mẫu (đủ tổ hợp goal × difficulty) + Món ăn + Thực đơn mẫu (đủ dải calo).
-- Kế hoạch/thực đơn để user_id = NULL, is_default = 1 (mẫu hệ thống).
-- Phụ thuộc: musclegroup/equipment/trainingtype (V6), chạy trên DB đã migrate sạch.
-- =============================================

-- ---------- 1. BÀI TẬP (14 bài, đủ level & nhóm cơ) ----------
INSERT INTO `exercises` (`name`,`description`,`training_type`,`level`,`is_deleted`,`met`,`created_at`,`updated_at`) VALUES
('Hít đất (Push-up)','Chống đẩy cơ bản với trọng lượng cơ thể',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER',0,3.8,NOW(),NOW()),
('Squat tạ đòn','Gánh tạ đòn, bài chân nền tảng',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'ADVANCED',0,5.0,NOW(),NOW()),
('Đẩy ngực tạ đòn (Bench Press)','Đẩy ngực với tạ đòn trên ghế',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'INTERMEDIATE',0,4.0,NOW(),NOW()),
('Deadlift','Nâng tạ đòn từ sàn, toàn thân sau',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'ADVANCED',0,5.5,NOW(),NOW()),
('Chèo tạ đơn (Dumbbell Row)','Kéo tạ đơn, cơ lưng xô',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'INTERMEDIATE',0,4.0,NOW(),NOW()),
('Lunge','Bước tấn, đùi và mông',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'BEGINNER',0,4.0,NOW(),NOW()),
('Plank','Giữ tư thế tấm ván, cơ lõi',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER',0,3.0,NOW(),NOW()),
('Hít xà (Pull-up)','Kéo xà đơn, lưng và tay trước',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'ADVANCED',0,5.0,NOW(),NOW()),
('Đẩy vai tạ đơn','Đẩy tạ đơn qua đầu, cơ vai',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'INTERMEDIATE',0,4.0,NOW(),NOW()),
('Cuốn tạ tay trước (Bicep Curl)','Cuốn tạ đơn, cơ tay trước',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'BEGINNER',0,3.5,NOW(),NOW()),
('Nhảy Jumping Jack','Cardio toàn thân cường độ nhẹ',(SELECT id FROM trainingtype WHERE name='Tim mạch (Cardio)'),'BEGINNER',0,8.0,NOW(),NOW()),
('Burpee','Bài toàn thân cường độ cao',(SELECT id FROM trainingtype WHERE name='Cường độ cao (HIIT)'),'ADVANCED',0,8.0,NOW(),NOW()),
('Leo núi (Mountain Climbers)','Cardio + cơ lõi',(SELECT id FROM trainingtype WHERE name='Cường độ cao (HIIT)'),'BEGINNER',0,8.0,NOW(),NOW()),
('Đạp đùi (Leg Press)','Máy đạp đùi trước',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'INTERMEDIATE',0,4.5,NOW(),NOW());

-- ---------- 1b. Nhóm cơ chính cho từng bài ----------
INSERT INTO `exercise_muscle_group` (`exercise_id`,`muscle_group_id`,`is_primary`,`created_at`,`updated_at`) VALUES
((SELECT id FROM exercises WHERE name='Hít đất (Push-up)'),(SELECT id FROM musclegroup WHERE name='Ngực (Chest)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Squat tạ đòn'),(SELECT id FROM musclegroup WHERE name='Đùi trước (Quadriceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Squat tạ đòn'),(SELECT id FROM musclegroup WHERE name='Mông (Glutes)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Đẩy ngực tạ đòn (Bench Press)'),(SELECT id FROM musclegroup WHERE name='Ngực (Chest)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Deadlift'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Deadlift'),(SELECT id FROM musclegroup WHERE name='Đùi sau (Hamstrings)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Chèo tạ đơn (Dumbbell Row)'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Lunge'),(SELECT id FROM musclegroup WHERE name='Đùi trước (Quadriceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Plank'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Hít xà (Pull-up)'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Đẩy vai tạ đơn'),(SELECT id FROM musclegroup WHERE name='Vai (Shoulders)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Cuốn tạ tay trước (Bicep Curl)'),(SELECT id FROM musclegroup WHERE name='Tay trước (Biceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Nhảy Jumping Jack'),(SELECT id FROM musclegroup WHERE name='Toàn thân (Full Body)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Burpee'),(SELECT id FROM musclegroup WHERE name='Toàn thân (Full Body)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Leo núi (Mountain Climbers)'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Đạp đùi (Leg Press)'),(SELECT id FROM musclegroup WHERE name='Đùi trước (Quadriceps)'),1,NOW(),NOW());

-- ---------- 1c. Dụng cụ cho từng bài ----------
INSERT INTO `exercise_equipment` (`exercise_id`,`equipment_id`) VALUES
((SELECT id FROM exercises WHERE name='Hít đất (Push-up)'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Squat tạ đòn'),(SELECT id FROM equipment WHERE name='Tạ đòn (Barbell)')),
((SELECT id FROM exercises WHERE name='Đẩy ngực tạ đòn (Bench Press)'),(SELECT id FROM equipment WHERE name='Tạ đòn (Barbell)')),
((SELECT id FROM exercises WHERE name='Đẩy ngực tạ đòn (Bench Press)'),(SELECT id FROM equipment WHERE name='Ghế tập (Bench)')),
((SELECT id FROM exercises WHERE name='Deadlift'),(SELECT id FROM equipment WHERE name='Tạ đòn (Barbell)')),
((SELECT id FROM exercises WHERE name='Chèo tạ đơn (Dumbbell Row)'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Lunge'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Plank'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Hít xà (Pull-up)'),(SELECT id FROM equipment WHERE name='Xà đơn (Pull-up Bar)')),
((SELECT id FROM exercises WHERE name='Đẩy vai tạ đơn'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Cuốn tạ tay trước (Bicep Curl)'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Nhảy Jumping Jack'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Burpee'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Leo núi (Mountain Climbers)'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Đạp đùi (Leg Press)'),(SELECT id FROM equipment WHERE name='Máy tập (Machine)'));

-- ---------- 2. KẾ HOẠCH MẪU (8 plan đủ tổ hợp goal × difficulty) ----------
-- Helper macro qua @vars: mỗi plan -> 2 buổi × 3 bài.

-- P1: LOSE_WEIGHT / BEGINNER / 3 buổi
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Giảm cân cho người mới','Cardio + bodyweight nhẹ nhàng, 3 buổi/tuần',1,3,4,NULL,'LOSE_WEIGHT','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Nhảy Jumping Jack'),3,20,NULL,60,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Hít đất (Push-up)'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),3,1,NULL,45,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Leo núi (Mountain Climbers)'),3,20,NULL,45,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,15,NULL,NULL,NOW(),NOW());

-- P2: LOSE_WEIGHT / INTERMEDIATE / 4 buổi
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Đốt mỡ tăng cường','Kết hợp tạ nhẹ và HIIT, 4 buổi/tuần',1,4,4,NULL,'LOSE_WEIGHT','INTERMEDIATE',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Burpee'),4,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Chèo tạ đơn (Dumbbell Row)'),3,12,10.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy vai tạ đơn'),3,12,8.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Leo núi (Mountain Climbers)'),4,20,NULL,45,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,14,NULL,NULL,NOW(),NOW());

-- P3: MUSCLE_GAIN / BEGINNER / 3 buổi
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cơ nhập môn','Làm quen bài tạ cơ bản, 3 buổi/tuần',1,3,4,NULL,'MUSCLE_GAIN','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Hít đất (Push-up)'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Cuốn tạ tay trước (Bicep Curl)'),3,12,6.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,12,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Đạp đùi (Leg Press)'),3,12,40.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy vai tạ đơn'),3,12,6.0,NULL,NOW(),NOW());

-- P4: MUSCLE_GAIN / INTERMEDIATE / 4 buổi
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cơ 4 buổi Upper/Lower','Chia trên/dưới, 4 buổi/tuần',1,4,6,NULL,'MUSCLE_GAIN','INTERMEDIATE',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Đẩy ngực tạ đòn (Bench Press)'),4,10,40.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Chèo tạ đơn (Dumbbell Row)'),4,10,14.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy vai tạ đơn'),3,10,10.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat tạ đòn'),4,10,50.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đạp đùi (Leg Press)'),3,12,60.0,NULL,NOW(),NOW());

-- P5: MUSCLE_GAIN / ADVANCED / 5 buổi
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cơ nâng cao 5 buổi','Khối lượng lớn cho người có kinh nghiệm, 5 buổi/tuần',1,5,8,NULL,'MUSCLE_GAIN','ADVANCED',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),5,5,80.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Hít xà (Pull-up)'),4,6,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Chèo tạ đơn (Dumbbell Row)'),4,8,20.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat tạ đòn'),5,5,90.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy ngực tạ đòn (Bench Press)'),4,6,60.0,NULL,NOW(),NOW());

-- P6: SHAPE_BODY / BEGINNER / 3 buổi
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Săn chắc toàn thân','Giữ dáng, toàn thân nhẹ nhàng, 3 buổi/tuần',1,3,4,NULL,'SHAPE_BODY','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Hít đất (Push-up)'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),3,1,NULL,45,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,12,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Nhảy Jumping Jack'),3,20,NULL,60,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Cuốn tạ tay trước (Bicep Curl)'),3,12,5.0,NULL,NOW(),NOW());

-- P7: SHAPE_BODY / INTERMEDIATE / 4 buổi
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Săn chắc & khỏe khoắn','Toàn thân + core, 4 buổi/tuần',1,4,6,NULL,'SHAPE_BODY','INTERMEDIATE',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,3,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Đẩy ngực tạ đòn (Bench Press)'),3,12,30.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Chèo tạ đơn (Dumbbell Row)'),3,12,12.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),3,1,NULL,60,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,6,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Đạp đùi (Leg Press)'),3,14,45.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy vai tạ đơn'),3,12,8.0,NULL,NOW(),NOW());

-- P8: GAIN_WEIGHT / INTERMEDIATE / 4 buổi
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cân & sức mạnh','Ăn nhiều + tạ nặng vừa, 4 buổi/tuần',1,4,6,NULL,'GAIN_WEIGHT','INTERMEDIATE',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat tạ đòn'),4,8,50.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy ngực tạ đòn (Bench Press)'),4,8,45.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Chèo tạ đơn (Dumbbell Row)'),3,10,16.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),4,6,70.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đạp đùi (Leg Press)'),3,10,70.0,NULL,NOW(),NOW());

-- ---------- 3. MÓN ĂN (10 món) ----------
INSERT INTO `dishes`(`name`,`calories`,`protein`,`fat`,`carbs`,`is_deleted`,`cooking_duration_minutes`,`created_at`,`updated_at`) VALUES
('Ức gà luộc (100g)',165,31,3.6,0,0,20,NOW(),NOW()),
('Cơm trắng (1 chén)',200,4,0.4,44,0,15,NOW(),NOW()),
('Trứng luộc (1 quả)',78,6,5,0.6,0,10,NOW(),NOW()),
('Yến mạch (60g)',230,8,4,40,0,5,NOW(),NOW()),
('Cá hồi áp chảo (100g)',208,20,13,0,0,15,NOW(),NOW()),
('Salad rau trộn',80,3,1.5,12,0,10,NOW(),NOW()),
('Chuối (1 quả)',105,1.3,0.4,27,0,1,NOW(),NOW()),
('Sữa chua Hy Lạp (150g)',130,11,4,9,0,1,NOW(),NOW()),
('Khoai lang luộc (150g)',135,2.5,0.2,31,0,25,NOW(),NOW()),
('Thịt bò xào (100g)',250,26,14,5,0,20,NOW(),NOW());

-- ---------- 4. THỰC ĐƠN MẪU (7 menu đủ dải calo × goal) ----------
-- Mỗi menu: 3 bữa (sáng/trưa/tối), gắn vài món qua dishes_meal.

-- M1: LOSE_WEIGHT ~1500
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn giảm cân 1500 kcal',NULL,'LOSE_WEIGHT',1500,0,1,'Ít calo, giàu đạm, hỗ trợ giảm cân',1500,120,140,45,1,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',360,19,49,9,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch (60g)'),@meal,1,230,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Sữa chua Hy Lạp (150g)'),@meal,1,130,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',445,35,44,7,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Ức gà luộc (100g)'),@meal,1,165,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,1,200,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Salad rau trộn'),@meal,1,80,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',288,23,12,15,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cá hồi áp chảo (100g)'),@meal,1,208,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Salad rau trộn'),@meal,1,80,NOW(),NOW());

-- M2: LOSE_WEIGHT ~1800
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn giảm cân 1800 kcal',NULL,'LOSE_WEIGHT',1800,0,1,'Giảm cân từ từ, đủ năng lượng tập',1800,135,170,50,2,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',413,15,67,9,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch (60g)'),@meal,1,230,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Chuối (1 quả)'),@meal,1,105,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Trứng luộc (1 quả)'),@meal,1,78,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',565,61,49,21,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Thịt bò xào (100g)'),@meal,1,250,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,1,200,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Ức gà luộc (100g)'),@meal,1,165,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',288,23,12,15,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cá hồi áp chảo (100g)'),@meal,1,208,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Salad rau trộn'),@meal,1,80,NOW(),NOW());

-- M3: MUSCLE_GAIN ~2500
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn tăng cơ 2500 kcal',NULL,'MUSCLE_GAIN',2500,0,1,'Nhiều đạm & tinh bột cho tăng cơ',2500,190,250,70,3,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',543,25,76,17,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch (60g)'),@meal,1,230,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Trứng luộc (1 quả)'),@meal,2,156,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Chuối (1 quả)'),@meal,1,105,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',730,57,93,17,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Ức gà luộc (100g)'),@meal,1,165,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,2,400,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Khoai lang luộc (150g)'),@meal,1,135,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',658,72,49,27,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Thịt bò xào (100g)'),@meal,1,250,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cá hồi áp chảo (100g)'),@meal,1,208,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,1,200,NOW(),NOW());

-- M4: MUSCLE_GAIN ~2800
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn tăng cơ 2800 kcal',NULL,'MUSCLE_GAIN',2800,0,1,'Tăng cơ mạnh cho người tập nặng',2800,210,290,78,4,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',621,31,85,19,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch (60g)'),@meal,1,230,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Trứng luộc (1 quả)'),@meal,2,156,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Sữa chua Hy Lạp (150g)'),@meal,1,130,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Chuối (1 quả)'),@meal,1,105,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',765,63,93,21,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Thịt bò xào (100g)'),@meal,1,250,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,2,400,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Ức gà luộc (100g)'),@meal,1,165,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',708,52,55,29,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cá hồi áp chảo (100g)'),@meal,1,208,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,1,200,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Khoai lang luộc (150g)'),@meal,2,270,NOW(),NOW());

-- M5: SHAPE_BODY ~2000
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn giữ dáng 2000 kcal',NULL,'SHAPE_BODY',2000,0,1,'Cân bằng để giữ dáng, săn chắc',2000,150,200,60,5,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',413,15,67,9,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch (60g)'),@meal,1,230,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Chuối (1 quả)'),@meal,1,105,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Trứng luộc (1 quả)'),@meal,1,78,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',565,50,49,17,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Ức gà luộc (100g)'),@meal,1,165,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,1,200,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Thịt bò xào (100g)'),@meal,1,250,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',343,25,43,15,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cá hồi áp chảo (100g)'),@meal,1,208,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Khoai lang luộc (150g)'),@meal,1,135,NOW(),NOW());

-- M6: SHAPE_BODY ~2200
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn giữ dáng 2200 kcal',NULL,'SHAPE_BODY',2200,0,1,'Giữ dáng cho người vận động nhiều',2200,160,220,65,6,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',491,26,76,14,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch (60g)'),@meal,1,230,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Sữa chua Hy Lạp (150g)'),@meal,1,130,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Chuối (1 quả)'),@meal,1,105,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',615,54,49,21,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Thịt bò xào (100g)'),@meal,1,250,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,1,200,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Ức gà luộc (100g)'),@meal,1,165,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',408,25,43,15,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cá hồi áp chảo (100g)'),@meal,1,208,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,1,200,NOW(),NOW());

-- M7: GAIN_WEIGHT ~3000
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn tăng cân 3000 kcal',NULL,'GAIN_WEIGHT',3000,0,1,'Thặng dư calo lớn để tăng cân',3000,200,340,90,7,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',621,31,85,19,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch (60g)'),@meal,1,230,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Trứng luộc (1 quả)'),@meal,2,156,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Sữa chua Hy Lạp (150g)'),@meal,1,130,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Chuối (1 quả)'),@meal,1,105,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',965,67,137,21,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Thịt bò xào (100g)'),@meal,1,250,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,3,600,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Khoai lang luộc (150g)'),@meal,1,135,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',773,72,49,27,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Ức gà luộc (100g)'),@meal,1,165,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cá hồi áp chảo (100g)'),@meal,1,208,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm trắng (1 chén)'),@meal,2,400,NOW(),NOW());
