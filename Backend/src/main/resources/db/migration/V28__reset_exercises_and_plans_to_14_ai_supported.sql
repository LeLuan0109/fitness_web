-- =============================================
-- V28: XÓA SẠCH toàn bộ bài tập + kế hoạch tập (mẫu VÀ cá nhân) + log tập hiện có,
--      TẠO LẠI đúng 14 bài tập mà AI camera hỗ trợ (đã fix key ở V27), kèm video/ảnh
--      thật lấy từ Pexels (free-license). Sau đó tạo lại bộ kế hoạch mẫu dùng đúng 14 bài này.
--
-- ⚠️ Đây là thao tác XÓA DỮ LIỆU CÓ CHỦ ĐÍCH theo yêu cầu dọn lại kho bài tập cho gọn,
--    không phải migration thông thường. Ảnh hưởng: mọi kế hoạch cá nhân + log tập cũ
--    (kể cả của user thật) sẽ mất, vì bài tập gốc chúng tham chiếu không còn tồn tại.
-- =============================================

-- ---------- 1. XÓA theo đúng thứ tự khóa ngoại (con trước, cha sau) ----------
DELETE FROM `workoutlogs`;
DELETE FROM `workoutday_exercises`;
DELETE FROM `workoutday`;
DELETE FROM `workoutplan`;
DELETE FROM `challenge_exercises`;
DELETE FROM `exercise_benefit`;
DELETE FROM `exercise_mistake`;
DELETE FROM `exercise_tip`;
DELETE FROM `exercise_step`;
DELETE FROM `exercise_muscle_group`;
DELETE FROM `exercise_equipment`;
DELETE FROM `exercises_equipment`;
DELETE FROM `exercises`;

ALTER TABLE `exercises` AUTO_INCREMENT = 1;
ALTER TABLE `workoutplan` AUTO_INCREMENT = 1;
ALTER TABLE `workoutday` AUTO_INCREMENT = 1;
ALTER TABLE `workoutday_exercises` AUTO_INCREMENT = 1;

-- ---------- 2. TẠO LẠI đúng 14 bài tập AI hỗ trợ (video/ảnh thật từ Pexels, free-license) ----------
INSERT INTO `exercises` (`name`,`description`,`training_type`,`level`,`ai_exercise_key`,`is_deleted`,`met`,`thumbnail`,`video_url`,`created_at`,`updated_at`) VALUES
('Squat','Ngồi xổm đứng lên, bài chân nền tảng',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'BEGINNER','SQUAT',0,5.0,
  'https://images.pexels.com/videos/4820063/ab-workout-exercise-motivation-4820063.jpeg?auto=compress&w=1260&h=750&dpr=1',
  'https://videos.pexels.com/video-files/4820063/4820063-hd_1920_1080_24fps.mp4',NOW(),NOW()),

('Sit-up','Gập bụng nằm, chạm gối',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER','SITUP',0,4.0,
  'https://images.pexels.com/videos/4259064/abdominal-exercise-at-home-athletic-couple-4259064.jpeg?auto=compress&w=1260&h=750&dpr=1',
  'https://videos.pexels.com/video-files/4259064/4259064-uhd_2560_1440_25fps.mp4',NOW(),NOW()),

('Push-up','Chống đẩy cơ bản với trọng lượng cơ thể',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER','PUSHUP',0,4.0,
  'https://images.pexels.com/videos/4812839/pexels-photo-4812839.jpeg?auto=compress&w=1260&h=750&dpr=1',
  'https://videos.pexels.com/video-files/4812839/4812839-uhd_2560_1440_25fps.mp4',NOW(),NOW()),

('Plank','Giữ tư thế tấm ván, chống khuỷu tay',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER','PLANK',0,3.0,
  'https://images.pexels.com/videos/4325592/body-fitness-guy-health-4325592.jpeg?auto=compress&w=1260&h=750&dpr=1',
  'https://videos.pexels.com/video-files/4325592/4325592-uhd_2732_1440_25fps.mp4',NOW(),NOW()),

('Biceps Curl','Cuốn tạ đơn tay trước',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'BEGINNER','BICEPS_CURL',0,3.5,
  'https://images.pexels.com/videos/5319426/pexels-photo-5319426.jpeg?auto=compress&w=1260&h=750&dpr=1',
  'https://videos.pexels.com/video-files/5319426/5319426-uhd_1440_2560_25fps.mp4',NOW(),NOW()),

('Pull-up','Kéo xà đơn, lưng & tay trước',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'ADVANCED','PULLUP',0,5.0,
  'https://images.pexels.com/videos/7672118/pexels-photo-7672118.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200',
  'https://videos.pexels.com/video-files/7672118/7672118-uhd_2732_1440_25fps.mp4',NOW(),NOW()),

('Back Lever','Treo xà giữ thân ngang, cơ lưng & core nâng cao',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'ADVANCED','BACK_LEVER',0,6.0,
  NULL, NULL, NOW(),NOW()),

('Deadlift','Kéo tạ đòn từ sàn lên, chuỗi sau toàn thân',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'ADVANCED','DEADLIFT',0,6.0,
  'https://images.pexels.com/videos/9778003/pexels-photo-9778003.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200',
  'https://videos.pexels.com/video-files/9778003/9778003-uhd_2560_1440_25fps.mp4',NOW(),NOW()),

('Lunge','Bước chùng chân, đùi & mông',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'BEGINNER','LUNGE',0,4.5,
  'https://images.pexels.com/videos/6892974/pexels-photo-6892974.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200',
  'https://videos.pexels.com/video-files/6892974/6892974-uhd_2560_1440_25fps.mp4',NOW(),NOW()),

('Glute Bridge','Nằm ngửa nâng hông, cơ mông & đùi sau',(SELECT id FROM trainingtype WHERE name='Calisthenics'),'BEGINNER','GLUTE_BRIDGE',0,3.0,
  'https://images.pexels.com/videos/8520042/pexels-photo-8520042.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200',
  'https://videos.pexels.com/video-files/8520042/8520042-uhd_2732_1122_25fps.mp4',NOW(),NOW()),

('Jumping Jack','Nhảy dang tay chân, cardio toàn thân',(SELECT id FROM trainingtype WHERE name='Tim mạch (Cardio)'),'BEGINNER','JUMPING_JACK',0,8.0,
  'https://images.pexels.com/videos/8402086/adult-architecture-ballet-beautiful-8402086.jpeg',
  'https://videos.pexels.com/video-files/8402086/8402086-hd_1920_1080_30fps.mp4',NOW(),NOW()),

('Overhead Press','Đẩy tạ đơn qua đầu, cơ vai',(SELECT id FROM trainingtype WHERE name='Tập sức mạnh (Strength)'),'INTERMEDIATE','OVERHEAD_PRESS',0,4.0,
  'https://images.pexels.com/videos/4367541/barbell-dumbbells-exercise-bike-fitness-equipment-4367541.jpeg',
  'https://videos.pexels.com/video-files/4367541/4367541-hd_1920_1080_30fps.mp4',NOW(),NOW()),

('Lateral Raise','Nâng tạ đơn sang ngang vai',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'BEGINNER','LATERAL_RAISE',0,3.0,
  'https://images.pexels.com/photos/29793977/pexels-photo-29793977.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200',
  NULL,NOW(),NOW()),

('Calf Raise','Nhón gót, bắp chân',(SELECT id FROM trainingtype WHERE name='Tăng cơ (Hypertrophy)'),'BEGINNER','CALF_RAISE',0,3.0,
  'https://images.pexels.com/videos/32115656/4k-bodybuilding-build-color-grade-32115656.jpeg',
  'https://videos.pexels.com/video-files/32115656/13692103_1440_2560_24fps.mp4',NOW(),NOW());

-- ---------- 3. Nhóm cơ chính/phụ ----------
INSERT INTO `exercise_muscle_group` (`exercise_id`,`muscle_group_id`,`is_primary`,`created_at`,`updated_at`) VALUES
((SELECT id FROM exercises WHERE name='Squat'),(SELECT id FROM musclegroup WHERE name='Đùi trước (Quadriceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Squat'),(SELECT id FROM musclegroup WHERE name='Mông (Glutes)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Sit-up'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Push-up'),(SELECT id FROM musclegroup WHERE name='Ngực (Chest)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Push-up'),(SELECT id FROM musclegroup WHERE name='Tay sau (Triceps)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Plank'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Biceps Curl'),(SELECT id FROM musclegroup WHERE name='Tay trước (Biceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Pull-up'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Pull-up'),(SELECT id FROM musclegroup WHERE name='Tay trước (Biceps)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Back Lever'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Back Lever'),(SELECT id FROM musclegroup WHERE name='Cơ bụng (Abs)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Deadlift'),(SELECT id FROM musclegroup WHERE name='Đùi sau (Hamstrings)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Deadlift'),(SELECT id FROM musclegroup WHERE name='Lưng / Xô (Back)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Lunge'),(SELECT id FROM musclegroup WHERE name='Đùi trước (Quadriceps)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Lunge'),(SELECT id FROM musclegroup WHERE name='Mông (Glutes)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Glute Bridge'),(SELECT id FROM musclegroup WHERE name='Mông (Glutes)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Glute Bridge'),(SELECT id FROM musclegroup WHERE name='Đùi sau (Hamstrings)'),0,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Jumping Jack'),(SELECT id FROM musclegroup WHERE name='Toàn thân (Full Body)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Overhead Press'),(SELECT id FROM musclegroup WHERE name='Vai (Shoulders)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Lateral Raise'),(SELECT id FROM musclegroup WHERE name='Vai (Shoulders)'),1,NOW(),NOW()),
((SELECT id FROM exercises WHERE name='Calf Raise'),(SELECT id FROM musclegroup WHERE name='Bắp chân (Calves)'),1,NOW(),NOW());

-- ---------- 4. Dụng cụ ----------
INSERT INTO `exercise_equipment` (`exercise_id`,`equipment_id`) VALUES
((SELECT id FROM exercises WHERE name='Squat'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Sit-up'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Push-up'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Plank'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Biceps Curl'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Pull-up'),(SELECT id FROM equipment WHERE name='Xà đơn (Pull-up Bar)')),
((SELECT id FROM exercises WHERE name='Back Lever'),(SELECT id FROM equipment WHERE name='Xà đơn (Pull-up Bar)')),
((SELECT id FROM exercises WHERE name='Deadlift'),(SELECT id FROM equipment WHERE name='Tạ đòn (Barbell)')),
((SELECT id FROM exercises WHERE name='Lunge'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Glute Bridge'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Jumping Jack'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)')),
((SELECT id FROM exercises WHERE name='Overhead Press'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Lateral Raise'),(SELECT id FROM equipment WHERE name='Tạ đơn (Dumbbell)')),
((SELECT id FROM exercises WHERE name='Calf Raise'),(SELECT id FROM equipment WHERE name='Trọng lượng cơ thể (Bodyweight)'));

-- ---------- 5. KẾ HOẠCH MẪU MỚI — chỉ dùng 14 bài trên ----------

-- [LOSE_WEIGHT / BEGINNER / 3]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Giảm cân cho người mới','Cardio + bodyweight nhẹ nhàng, 3 buổi/tuần',1,3,4,NULL,'LOSE_WEIGHT','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Jumping Jack'),3,20,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Squat'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),3,NULL,NULL,30,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Push-up'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Sit-up'),3,15,NULL,NULL,NOW(),NOW());

-- [LOSE_WEIGHT / INTERMEDIATE / 4]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Đốt mỡ tăng cường','Kết hợp cardio và toàn thân, 4 buổi/tuần',1,4,6,NULL,'LOSE_WEIGHT','INTERMEDIATE',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Jumping Jack'),4,25,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Squat'),4,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Glute Bridge'),3,15,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Push-up'),4,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),3,NULL,NULL,40,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Calf Raise'),3,20,NULL,NULL,NOW(),NOW());

-- [LOSE_WEIGHT / ADVANCED / 5]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Đốt mỡ nâng cao 5 buổi','HIIT + sức mạnh cường độ cao, 5 buổi/tuần',1,5,6,NULL,'LOSE_WEIGHT','ADVANCED',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Jumping Jack'),5,25,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),4,10,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Pull-up'),4,8,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat'),5,20,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Push-up'),4,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),4,NULL,NULL,50,NOW(),NOW());

-- [GAIN_WEIGHT / BEGINNER / 3]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cân nhập môn','Bài cơ bản + ăn nhiều, 3 buổi/tuần',1,3,4,NULL,'GAIN_WEIGHT','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Push-up'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Overhead Press'),3,12,10.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Biceps Curl'),3,12,10.0,NULL,NOW(),NOW());

-- [GAIN_WEIGHT / ADVANCED / 5]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cân & sức mạnh nâng cao','Tạ nặng compound, 5 buổi/tuần',1,5,8,NULL,'GAIN_WEIGHT','ADVANCED',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat'),5,5,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),5,5,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Pull-up'),5,6,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Overhead Press'),4,8,15.0,NULL,NOW(),NOW());

-- [MUSCLE_GAIN / INTERMEDIATE / 3 — Full-body]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cơ Full-body 3 buổi','Full-body toàn diện, 3 buổi/tuần',1,3,6,NULL,'MUSCLE_GAIN','INTERMEDIATE',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat'),4,10,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Pull-up'),3,8,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Push-up'),3,12,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Overhead Press'),3,10,12.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lateral Raise'),3,12,5.0,NULL,NOW(),NOW());

-- [MUSCLE_GAIN / INTERMEDIATE / 4 — Upper/Lower]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cơ 4 buổi Upper/Lower','Chia trên/dưới, 4 buổi/tuần',1,4,8,NULL,'MUSCLE_GAIN','INTERMEDIATE',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Pull-up'),4,8,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Push-up'),4,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Biceps Curl'),3,12,10.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Overhead Press'),3,10,12.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lateral Raise'),3,12,5.0,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat'),4,10,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Glute Bridge'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),4,8,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Calf Raise'),3,20,NULL,NULL,NOW(),NOW());

-- [MUSCLE_GAIN / ADVANCED / 5]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Tăng cơ nâng cao 5 buổi','Compound + isolation, 5 buổi/tuần',1,5,8,NULL,'MUSCLE_GAIN','ADVANCED',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),5,6,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Pull-up'),5,8,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Back Lever'),3,NULL,NULL,10,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,5,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat'),5,8,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Overhead Press'),4,8,15.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lateral Raise'),3,12,5.0,NULL,NOW(),NOW());

-- [SHAPE_BODY / BEGINNER / 3]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Săn chắc toàn thân','Giữ dáng, toàn thân nhẹ nhàng, 3 buổi/tuần',1,3,6,NULL,'SHAPE_BODY','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,3,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Push-up'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),3,NULL,NULL,30,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,6,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Glute Bridge'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Jumping Jack'),3,20,NULL,NULL,NOW(),NOW());

-- [SHAPE_BODY / ADVANCED / 5]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Săn chắc nâng cao','Toàn thân cường độ cao, 5 buổi/tuần',1,5,6,NULL,'SHAPE_BODY','ADVANCED',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,3,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Pull-up'),4,10,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Back Lever'),3,NULL,NULL,10,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Push-up'),4,15,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,6,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),4,8,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lateral Raise'),3,12,5.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Calf Raise'),3,20,NULL,NULL,NOW(),NOW());

-- [SHAPE_BODY / BEGINNER / 3 — flagship "Toàn thân với AI Camera", dùng đủ 14 bài trải 3 buổi]
INSERT INTO `workoutplan`(`name`,`description`,`is_default`,`days_per_week`,`duration_week`,`user_id`,`target_goal`,`difficulty_level`,`is_deleted`,`created_at`,`updated_at`)
VALUES('Toàn thân với AI Camera','3 buổi/tuần, dùng camera AI đếm rep tự động cho toàn bộ bài tập',1,3,4,NULL,'SHAPE_BODY','BEGINNER',0,NOW(),NOW());
SET @p:=LAST_INSERT_ID();
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,2,1,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Squat'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lunge'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Glute Bridge'),3,15,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Push-up'),3,12,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Plank'),3,NULL,NULL,30,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,4,2,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Pull-up'),3,8,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Biceps Curl'),3,12,10.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Overhead Press'),3,12,10.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Lateral Raise'),3,12,5.0,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Sit-up'),3,15,NULL,NULL,NOW(),NOW());
INSERT INTO `workoutday`(`workout_plan_id`,`day_of_week`,`day_in_number`,`week_number`,`is_deleted`,`created_at`,`updated_at`) VALUES(@p,6,3,1,0,NOW(),NOW());
SET @d:=LAST_INSERT_ID();
INSERT INTO `workoutday_exercises`(`workout_day_id`,`exercises_id`,`sets`,`reps`,`weight`,`duration`,`created_at`,`updated_at`) VALUES
(@d,(SELECT id FROM exercises WHERE name='Deadlift'),3,10,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Jumping Jack'),3,20,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Calf Raise'),3,20,NULL,NULL,NOW(),NOW()),
(@d,(SELECT id FROM exercises WHERE name='Back Lever'),3,NULL,NULL,15,NOW(),NOW());
