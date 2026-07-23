-- =============================================
-- V25: BỔ SUNG thêm bài tập, món ăn, kế hoạch & thực đơn (làm dày kho đề xuất)
-- Chạy trên DB đã có V24. Tham chiếu musclegroup/equipment/trainingtype theo tên (V6).
-- =============================================

-- ---------- 1. THÊM 18 BÀI TẬP ----------
INSERT INTO `exercises` (`name`,`description`,`training_type`,`level`,`is_deleted`,`met`,`created_at`,`updated_at`) VALUES
('Đẩy vai tạ đòn (Overhead Press)','Đẩy tạ đòn qua đầu, cơ vai',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'INTERMEDIATE',0,4.0,NOW(),NOW()),
('Gập bụng (Crunch)','Gập thân trên, cơ bụng',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER',0,3.0,NOW(),NOW()),
('Kéo xô cáp (Lat Pulldown)','Kéo cáp trên, cơ lưng xô',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'INTERMEDIATE',0,4.0,NOW(),NOW()),
('Đẩy ngực tạ đơn','Đẩy tạ đơn trên ghế, cơ ngực',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'INTERMEDIATE',0,4.0,NOW(),NOW()),
('Front Squat','Gánh tạ trước, đùi trước',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'ADVANCED',0,5.0,NOW(),NOW()),
('Nhảy dây','Cardio nhịp cao với dây nhảy',(SELECT id FROM trainingtype WHERE name='Tim mạch (Cardio)'),'BEGINNER',0,10.0,NOW(),NOW()),
('Đạp xe tại chỗ','Cardio với xe đạp tập',(SELECT id FROM trainingtype WHERE name='Tim mạch (Cardio)'),'BEGINNER',0,7.0,NOW(),NOW()),
('Chạy bộ máy','Chạy bộ trên máy',(SELECT id FROM trainingtype WHERE name='Tim mạch (Cardio)'),'BEGINNER',0,9.0,NOW(),NOW()),
('Hít xà rộng','Kéo xà bản rộng, lưng',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'ADVANCED',0,5.0,NOW(),NOW()),
('Chống đẩy xà kép (Dips)','Chống đẩy xà kép, ngực & tay sau',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'INTERMEDIATE',0,5.0,NOW(),NOW()),
('Cuốn tạ búa (Hammer Curl)','Cuốn tạ đơn kiểu búa, tay trước',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'BEGINNER',0,3.5,NOW(),NOW()),
('Duỗi tay sau tạ đơn','Duỗi tạ sau đầu, cơ tay sau',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'BEGINNER',0,3.5,NOW(),NOW()),
('Gập chân máy (Leg Curl)','Máy gập chân, đùi sau',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'INTERMEDIATE',0,4.0,NOW(),NOW()),
('Nhón bắp chân (Calf Raise)','Nhón gót, bắp chân',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'BEGINNER',0,3.0,NOW(),NOW()),
('Nâng chân treo xà','Treo xà nâng chân, cơ bụng dưới',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'ADVANCED',0,4.0,NOW(),NOW()),
('Kettlebell Swing','Vung tạ ấm, mông & toàn thân',(SELECT id FROM trainingtype WHERE name='Cường độ cao (HIIT)'),'INTERMEDIATE',0,6.0,NOW(),NOW()),
('Plank nghiêng (Side Plank)','Plank một bên, cơ liên sườn',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER',0,3.0,NOW(),NOW()),
('Squat bật nhảy (Jump Squat)','Squat kèm bật nhảy, plyometric',(SELECT id FROM trainingtype WHERE name='Bài tập bật nhảy (Plyometrics)'),'INTERMEDIATE',0,8.0,NOW(),NOW());

-- 1b. Nhóm cơ chính
INSERT INTO `exercise_muscle_group` (`exercise_id`,`muscle_group_id`,`is_primary`,`created_at`,`updated_at`) VALUES
((SELECT id FROM exercises WHERE name='Đẩy vai tạ đòn (Overhead Press)'),(SELECT id FROM musclegroup WHERE name='Vai (Shoulders)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Gập bụng (Crunch)'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Kéo xô cáp (Lat Pulldown)'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Đẩy ngực tạ đơn'),(SELECT id FROM musclegroup WHERE name='Ngực (Chest)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Front Squat'),(SELECT id FROM musclegroup WHERE name='Đùi trước (Quadriceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Nhảy dây'),(SELECT id FROM musclegroup WHERE name='Toàn thân (Full Body)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Đạp xe tại chỗ'),(SELECT id FROM musclegroup WHERE name='Toàn thân (Full Body)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Chạy bộ máy'),(SELECT id FROM musclegroup WHERE name='Toàn thân (Full Body)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Hít xà rộng'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Chống đẩy xà kép (Dips)'),(SELECT id FROM musclegroup WHERE name='Tay sau (Triceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Cuốn tạ búa (Hammer Curl)'),(SELECT id FROM musclegroup WHERE name='Tay trước (Biceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Duỗi tay sau tạ đơn'),(SELECT id FROM musclegroup WHERE name='Tay sau (Triceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Gập chân máy (Leg Curl)'),(SELECT id FROM musclegroup WHERE name='Đùi sau (Hamstrings)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Nhón bắp chân (Calf Raise)'),(SELECT id FROM musclegroup WHERE name='Bắp chân (Calves)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Nâng chân treo xà'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Kettlebell Swing'),(SELECT id FROM musclegroup WHERE name='Mông (Glutes)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Plank nghiêng (Side Plank)'),(SELECT id FROM musclegroup WHERE name='Liên sườn (Obliques)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Squat bật nhảy (Jump Squat)'),(SELECT id FROM musclegroup WHERE name='Đùi trước (Quadriceps)'),1,NOW(),NOW());

-- 1c. Dụng cụ
INSERT INTO `exercise_equipment` (`exercise_id`,`equipment_id`) VALUES
((SELECT id FROM exercises WHERE name='Đẩy vai tạ đòn (Overhead Press)'),(SELECT id FROM equipment WHERE name='Tạ đòn (Barbell)')),
((SELECT id FROM exercises WHERE name='Gập bụng (Crunch)'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Kéo xô cáp (Lat Pulldown)'),(SELECT id FROM equipment WHERE name='Dây cáp (Cable)')),
((SELECT id FROM exercises WHERE name='Đẩy ngực tạ đơn'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Đẩy ngực tạ đơn'),(SELECT id FROM equipment WHERE name='Ghế tập (Bench)')),
((SELECT id FROM exercises WHERE name='Front Squat'),(SELECT id FROM equipment WHERE name='Tạ đòn (Barbell)')),
((SELECT id FROM exercises WHERE name='Nhảy dây'),(SELECT id FROM equipment WHERE name='Dây nhảy (Jump Rope)')),
((SELECT id FROM exercises WHERE name='Đạp xe tại chỗ'),(SELECT id FROM equipment WHERE name='Xe đạp tập (Exercise Bike)')),
((SELECT id FROM exercises WHERE name='Chạy bộ máy'),(SELECT id FROM equipment WHERE name='Máy chạy bộ (Treadmill)')),
((SELECT id FROM exercises WHERE name='Hít xà rộng'),(SELECT id FROM equipment WHERE name='Xà đơn (Pull-up Bar)')),
((SELECT id FROM exercises WHERE name='Chống đẩy xà kép (Dips)'),(SELECT id FROM equipment WHERE name='Xà kép (Dip Bar)')),
((SELECT id FROM exercises WHERE name='Cuốn tạ búa (Hammer Curl)'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Duỗi tay sau tạ đơn'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Gập chân máy (Leg Curl)'),(SELECT id FROM equipment WHERE name='Máy tập (Machine)')),
((SELECT id FROM exercises WHERE name='Nhón bắp chân (Calf Raise)'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Nâng chân treo xà'),(SELECT id FROM equipment WHERE name='Xà đơn (Pull-up Bar)')),
((SELECT id FROM exercises WHERE name='Kettlebell Swing'),(SELECT id FROM equipment WHERE name='Tạ ấm (Kettlebell)')),
((SELECT id FROM exercises WHERE name='Plank nghiêng (Side Plank)'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Squat bật nhảy (Jump Squat)'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)'));

-- ---------- 2. THÊM 22 MÓN ĂN ----------
INSERT INTO `dishes`(`name`,`calories`,`protein`,`fat`,`carbs`,`is_deleted`,`cooking_duration_minutes`,`created_at`,`updated_at`) VALUES
('Phở bò (1 tô)',350,25,8,50,0,30,NOW(),NOW()),
('Bún chả',450,30,12,55,0,30,NOW(),NOW()),
('Cơm gà',550,35,15,70,0,25,NOW(),NOW()),
('Trứng ốp la (2 quả)',180,12,14,1,0,10,NOW(),NOW()),
('Bánh mì trứng',300,12,10,40,0,10,NOW(),NOW()),
('Sữa tươi không đường (250ml)',120,8,5,12,0,1,NOW(),NOW()),
('Whey protein (1 scoop)',120,24,1.5,3,0,1,NOW(),NOW()),
('Bơ (1/2 quả)',160,2,15,9,0,1,NOW(),NOW()),
('Hạnh nhân (30g)',170,6,15,6,0,1,NOW(),NOW()),
('Cá ngừ (100g)',130,28,1,0,0,10,NOW(),NOW()),
('Tôm hấp (100g)',99,24,0.3,0.2,0,15,NOW(),NOW()),
('Đậu phụ (100g)',76,8,4.8,1.9,0,10,NOW(),NOW()),
('Rau muống luộc',30,3,0.3,5,0,10,NOW(),NOW()),
('Bông cải xanh (100g)',55,3.7,0.6,11,0,10,NOW(),NOW()),
('Táo (1 quả)',95,0.5,0.3,25,0,1,NOW(),NOW()),
('Cam (1 quả)',62,1.2,0.2,15,0,1,NOW(),NOW()),
('Yến mạch chuối (bowl)',320,10,7,55,0,5,NOW(),NOW()),
('Cơm gạo lứt (1 chén)',215,5,1.6,45,0,20,NOW(),NOW()),
('Ngũ cốc granola (50g)',220,5,8,36,0,1,NOW(),NOW()),
('Ức gà nướng mật ong (150g)',250,40,5,10,0,25,NOW(),NOW()),
('Bò bít tết (150g)',350,36,22,0,0,20,NOW(),NOW()),
('Khoai tây nghiền (150g)',160,3,2,34,0,20,NOW(),NOW());

-- ---------- 3. THÊM 6 KẾ HOẠCH (lấp nhóm còn thiếu) ----------

-- LOSE_WEIGHT / ADVANCED / 5
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Đốt mỡ nâng cao 5 buổi','HIIT + tạ cường độ cao, 5 buổi/tuần',1,5,6,NULL,'LOSE_WEIGHT','ADVANCED',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Burpee'),5,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Kettlebell Swing'),4,15,16.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Squat bật nhảy (Jump Squat)'),4,15,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Chạy bộ máy'),1,1,NULL,1800,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Nâng chân treo xà'),4,12,NULL,NULL,NOW(),NOW());

-- GAIN_WEIGHT / BEGINNER / 3
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cân nhập môn','Bài cơ bản + ăn nhiều, 3 buổi/tuần',1,3,4,NULL,'GAIN_WEIGHT','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Đẩy ngực tạ đơn'),3,12,12.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy vai tạ đòn (Overhead Press)'),3,12,20.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat tạ đòn'),3,12,40.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Cuốn tạ búa (Hammer Curl)'),3,12,8.0,NULL,NOW(),NOW());

-- GAIN_WEIGHT / ADVANCED / 5
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cân & sức mạnh nâng cao','Tạ nặng compound, 5 buổi/tuần',1,5,8,NULL,'GAIN_WEIGHT','ADVANCED',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat tạ đòn'),5,5,100.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy ngực tạ đòn (Bench Press)'),5,5,70.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Front Squat'),4,6,70.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),5,5,120.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Hít xà rộng'),4,8,NULL,NULL,NOW(),NOW());

-- SHAPE_BODY / ADVANCED / 5
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Săn chắc nâng cao','Toàn thân cường độ cao, 5 buổi/tuần',1,5,6,NULL,'SHAPE_BODY','ADVANCED',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,3,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Chống đẩy xà kép (Dips)'),4,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Hít xà rộng'),4,10,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank nghiêng (Side Plank)'),3,1,NULL,45,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,6,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Front Squat'),4,8,50.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Kettlebell Swing'),4,15,16.0,NULL,NOW(),NOW());

-- LOSE_WEIGHT / BEGINNER / 4 (biến thể)
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Giảm cân tại nhà không dụng cụ','Toàn bodyweight, 4 buổi/tuần',1,4,4,NULL,'LOSE_WEIGHT','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Nhảy dây'),3,1,NULL,120,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Gập bụng (Crunch)'),3,20,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Hít đất (Push-up)'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Nhón bắp chân (Calf Raise)'),3,20,NULL,NULL,NOW(),NOW());

-- MUSCLE_GAIN / INTERMEDIATE / 3 (biến thể Full-body)
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cơ Full-body 3 buổi','Full-body toàn diện, 3 buổi/tuần',1,3,6,NULL,'MUSCLE_GAIN','INTERMEDIATE',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat tạ đòn'),4,10,50.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Kéo xô cáp (Lat Pulldown)'),3,12,40.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy ngực tạ đơn'),3,12,16.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Gập chân máy (Leg Curl)'),3,12,30.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Đẩy vai tạ đòn (Overhead Press)'),3,10,30.0,NULL,NOW(),NOW());

-- ---------- 4. THÊM 8 THỰC ĐƠN (lấp dải calo) ----------

-- LOSE_WEIGHT 1300
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn giảm cân 1300 kcal',NULL,'LOSE_WEIGHT',1300,0,1,'Cắt giảm mạnh, giàu đạm giữ cơ',1300,115,110,40,8,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',298,20,13,17,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Trứng ốp la (2 quả)'),@meal,1,180,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Sữa tươi không đường (250ml)'),@meal,1,120,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',430,52,25,15,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Ức gà nướng mật ong (150g)'),@meal,1,250,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Bông cải xanh (100g)'),@meal,1,55,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm gạo lứt (1 chén)'),@meal,1,215,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',229,52,0.2,1,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cá ngừ (100g)'),@meal,1,130,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Tôm hấp (100g)'),@meal,1,99,NOW(),NOW());

-- LOSE_WEIGHT 1600
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn giảm cân 1600 kcal',NULL,'LOSE_WEIGHT',1600,0,1,'Giảm cân vừa phải, dễ theo',1600,125,150,45,9,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',440,18,80,11,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch chuối (bowl)'),@meal,1,320,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Táo (1 quả)'),@meal,1,95,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',350,25,50,8,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Phở bò (1 tô)'),@meal,1,350,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',305,42,10,12,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Ức gà nướng mật ong (150g)'),@meal,1,250,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Rau muống luộc'),@meal,1,30,NOW(),NOW());

-- MUSCLE_GAIN 2200
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn tăng cơ 2200 kcal',NULL,'MUSCLE_GAIN',2200,0,1,'Tăng cơ nhẹ nhàng, đủ đạm',2200,170,210,65,10,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',540,34,60,17,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch chuối (bowl)'),@meal,1,320,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Whey protein (1 scoop)'),@meal,1,120,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Sữa tươi không đường (250ml)'),@meal,1,120,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',765,54,120,15,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cơm gà'),@meal,1,550,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm gạo lứt (1 chén)'),@meal,1,215,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',350,36,0,22,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Bò bít tết (150g)'),@meal,1,350,NOW(),NOW());

-- MUSCLE_GAIN 3000
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn tăng cơ 3000 kcal',NULL,'MUSCLE_GAIN',3000,0,1,'Bulking đủ đạm & tinh bột',3000,220,320,85,11,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',660,39,96,20,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch chuối (bowl)'),@meal,1,320,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Whey protein (1 scoop)'),@meal,1,120,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Bánh mì trứng'),@meal,1,300,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',1100,71,140,30,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cơm gà'),@meal,2,1100,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',510,44,34,22,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Bò bít tết (150g)'),@meal,1,350,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Khoai tây nghiền (150g)'),@meal,1,160,NOW(),NOW());

-- SHAPE_BODY 1800
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn giữ dáng 1800 kcal',NULL,'SHAPE_BODY',1800,0,1,'Cân bằng, gọn nhẹ',1800,135,180,55,12,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',415,15,72,8,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch chuối (bowl)'),@meal,1,320,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cam (1 quả)'),@meal,1,62,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',450,30,55,12,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Bún chả'),@meal,1,450,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',329,32,45,4,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Đậu phụ (100g)'),@meal,1,76,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm gạo lứt (1 chén)'),@meal,1,215,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Rau muống luộc'),@meal,1,30,NOW(),NOW());

-- SHAPE_BODY 2400
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn giữ dáng 2400 kcal',NULL,'SHAPE_BODY',2400,0,1,'Cho người vận động nhiều',2400,170,240,70,13,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',540,29,72,17,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch chuối (bowl)'),@meal,1,320,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Whey protein (1 scoop)'),@meal,1,120,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Táo (1 quả)'),@meal,1,95,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',550,35,70,15,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cơm gà'),@meal,1,550,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',450,50,10,22,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Bò bít tết (150g)'),@meal,1,350,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Bông cải xanh (100g)'),@meal,1,55,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cam (1 quả)'),@meal,1,62,NOW(),NOW());

-- GAIN_WEIGHT 2600
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn tăng cân 2600 kcal',NULL,'GAIN_WEIGHT',2600,0,1,'Thặng dư vừa để tăng cân từ từ',2600,175,300,75,14,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',540,26,66,22,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Bánh mì trứng'),@meal,1,300,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Sữa tươi không đường (250ml)'),@meal,1,120,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Hạnh nhân (30g)'),@meal,1,170,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',765,54,120,15,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cơm gà'),@meal,1,550,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm gạo lứt (1 chén)'),@meal,1,215,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',510,44,34,22,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Bò bít tết (150g)'),@meal,1,350,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Khoai tây nghiền (150g)'),@meal,1,160,NOW(),NOW());

-- GAIN_WEIGHT 3400
INSERT INTO `menu`(`name`,`user_id`,`target_goal`,`calories_target`,`is_deleted`,`is_default`,`description`,`calories`,`protein`,`carbs`,`fat`,`display_order`,`created_at`,`updated_at`)
VALUES('Thực đơn tăng cân 3400 kcal',NULL,'GAIN_WEIGHT',3400,0,1,'Thặng dư lớn cho người khó tăng cân',3400,220,380,100,15,NOW(),NOW());
SET @m:=LAST_INSERT_ID();
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa sáng',@m,'BREAKFAST',760,49,102,25,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Yến mạch chuối (bowl)'),@meal,1,320,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Whey protein (1 scoop)'),@meal,1,120,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Bánh mì trứng'),@meal,1,300,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa trưa',@m,'LUNCH',1100,71,140,30,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Cơm gà'),@meal,2,1100,NOW(),NOW());
INSERT INTO `meal`(`name`,`menu_id`,`meal_type`,`calories`,`protein`,`carbs`,`fat`,`is_deleted`,`created_at`,`updated_at`) VALUES('Bữa tối',@m,'DINNER',740,64,44,32,0,NOW(),NOW());
SET @meal:=LAST_INSERT_ID();
INSERT INTO `dishes_meal`(`dish_id`,`meal_id`,`quantity`,`total_calories`,`created_at`,`updated_at`) VALUES
((SELECT id FROM dishes WHERE name='Bò bít tết (150g)'),@meal,1,350,NOW(),NOW()),
((SELECT id FROM dishes WHERE name='Cơm gà'),@meal,1,550,NOW(),NOW());
