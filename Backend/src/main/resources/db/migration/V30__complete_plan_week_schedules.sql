-- Fix: V28 only created 2-3 mẫu "buổi" cho week_number=1 của mỗi kế hoạch mẫu,
-- không đủ days_per_week khai báo, và hoàn toàn thiếu dữ liệu cho các tuần 2..duration_week.
-- Bước 1: bổ sung đủ số buổi còn thiếu trong Tuần 1 cho từng kế hoạch.
-- Bước 2: nhân bản lịch Tuần 1 (đã đủ) sang các tuần còn lại (2..duration_week) cho MỌI kế hoạch.

-- ============ BƯỚC 1: bổ sung buổi còn thiếu trong Tuần 1 ============

-- 1. Giảm cân cho người mới (days_per_week=3, hiện có 2 buổi: T3, T6) -> thêm CN
SET @p := (SELECT id FROM workoutplan WHERE name='Giảm cân cho người mới' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 10, 3, 15, NULL, NULL, NOW(), NOW()),
(@d, 14, 3, 20, NULL, NULL, NOW(), NOW()),
(@d, 11, 3, 20, NULL, NULL, NOW(), NOW());

-- 2. Đốt mỡ tăng cường (days_per_week=4, hiện có 2 buổi: T3, T5) -> thêm T7, CN
SET @p := (SELECT id FROM workoutplan WHERE name='Đốt mỡ tăng cường' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 6, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 9, 3, 12, NULL, NULL, NOW(), NOW()),
(@d, 2, 3, 15, NULL, NULL, NOW(), NOW()),
(@d, 14, 3, 20, NULL, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 4, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 1, 4, 15, NULL, NULL, NOW(), NOW()),
(@d, 3, 3, 12, NULL, NULL, NOW(), NOW()),
(@d, 4, 3, NULL, NULL, 30, NOW(), NOW());

-- 3. Đốt mỡ nâng cao 5 buổi (days_per_week=5, hiện có 2 buổi: T3, T5) -> thêm T4, T7, CN
SET @p := (SELECT id FROM workoutplan WHERE name='Đốt mỡ nâng cao 5 buổi' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 3, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 9, 4, 12, NULL, NULL, NOW(), NOW()),
(@d, 2, 4, 15, NULL, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 6, 4, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 10, 4, 15, NULL, NULL, NOW(), NOW()),
(@d, 14, 4, 20, NULL, NULL, NOW(), NOW()),
(@d, 11, 5, 25, NULL, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 5, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 8, 4, 10, NULL, NULL, NOW(), NOW()),
(@d, 6, 4, 8, NULL, NULL, NOW(), NOW()),
(@d, 3, 4, 15, NULL, NULL, NOW(), NOW());

-- 4. Tăng cân nhập môn (days_per_week=3, hiện có 2 buổi: T3, T6) -> thêm CN
SET @p := (SELECT id FROM workoutplan WHERE name='Tăng cân nhập môn' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 9, 3, 12, NULL, NULL, NOW(), NOW()),
(@d, 10, 3, 15, NULL, NULL, NOW(), NOW());

-- 5. Tăng cân & sức mạnh nâng cao (days_per_week=5, hiện có 2 buổi: T3, T5) -> thêm T4, T7, CN
SET @p := (SELECT id FROM workoutplan WHERE name='Tăng cân & sức mạnh nâng cao' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 3, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 13, 4, 8, 5, NULL, NOW(), NOW()),
(@d, 5, 4, 8, 12, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 6, 4, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 9, 5, 8, NULL, NULL, NOW(), NOW()),
(@d, 14, 4, 15, NULL, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 5, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 1, 5, 5, NULL, NULL, NOW(), NOW()),
(@d, 8, 5, 5, NULL, NULL, NOW(), NOW()),
(@d, 6, 5, 6, NULL, NULL, NOW(), NOW());

-- 6. Tăng cơ Full-body 3 buổi (days_per_week=3, hiện có 2 buổi: T3, T6) -> thêm CN
SET @p := (SELECT id FROM workoutplan WHERE name='Tăng cơ Full-body 3 buổi' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 5, 3, 12, 10, NULL, NOW(), NOW()),
(@d, 10, 3, 15, NULL, NULL, NOW(), NOW()),
(@d, 14, 3, 20, NULL, NULL, NOW(), NOW());

-- 7. Tăng cơ 4 buổi Upper/Lower (days_per_week=4, hiện có 2 buổi: T3(upper), T6(lower)) -> thêm T5(upper2), CN(lower2)
SET @p := (SELECT id FROM workoutplan WHERE name='Tăng cơ 4 buổi Upper/Lower' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 4, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 3, 4, 12, NULL, NULL, NOW(), NOW()),
(@d, 5, 4, 10, 10, NULL, NOW(), NOW()),
(@d, 12, 3, 10, 12, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 4, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 1, 4, 10, NULL, NULL, NOW(), NOW()),
(@d, 9, 3, 12, NULL, NULL, NOW(), NOW()),
(@d, 8, 4, 8, NULL, NULL, NOW(), NOW());

-- 8. Tăng cơ nâng cao 5 buổi (days_per_week=5, hiện có 2 buổi: T3, T6) -> thêm T4, T5, T7
SET @p := (SELECT id FROM workoutplan WHERE name='Tăng cơ nâng cao 5 buổi' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 4, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 3, 4, 15, NULL, NULL, NOW(), NOW()),
(@d, 5, 4, 10, 10, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 5, 4, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 9, 4, 10, NULL, NULL, NOW(), NOW()),
(@d, 10, 4, 15, NULL, NULL, NOW(), NOW()),
(@d, 14, 4, 20, NULL, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 6, 5, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 8, 5, 6, NULL, NULL, NOW(), NOW()),
(@d, 6, 5, 8, NULL, NULL, NOW(), NOW()),
(@d, 3, 4, 15, NULL, NULL, NOW(), NOW());

-- 9. Săn chắc toàn thân (days_per_week=3, hiện có 2 buổi: T4, T7) -> thêm CN
SET @p := (SELECT id FROM workoutplan WHERE name='Săn chắc toàn thân' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 2, 3, 15, NULL, NULL, NOW(), NOW()),
(@d, 14, 3, 20, NULL, NULL, NOW(), NOW()),
(@d, 5, 3, 12, 8, NULL, NOW(), NOW());

-- 10. Săn chắc nâng cao (days_per_week=5, hiện có 2 buổi: T4, T7) -> thêm T3, T5, CN
SET @p := (SELECT id FROM workoutplan WHERE name='Săn chắc nâng cao' AND is_default=1);
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 2, 3, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 1, 4, 12, NULL, NULL, NOW(), NOW()),
(@d, 9, 4, 12, NULL, NULL, NOW(), NOW()),
(@d, 10, 4, 15, NULL, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 4, 4, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 12, 4, 10, 12, NULL, NOW(), NOW()),
(@d, 5, 4, 10, 10, NULL, NOW(), NOW()),
(@d, 11, 4, 20, NULL, NULL, NOW(), NOW());
INSERT INTO workoutday(workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
VALUES (@p, 7, 5, 1, 0, NOW(), NOW());
SET @d := LAST_INSERT_ID();
INSERT INTO workoutday_exercises(workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at) VALUES
(@d, 6, 4, 10, NULL, NULL, NOW(), NOW()),
(@d, 3, 4, 15, NULL, NULL, NOW(), NOW()),
(@d, 4, 3, NULL, NULL, 30, NOW(), NOW());

-- "Toàn thân với AI Camera" đã có đủ 3 buổi khớp days_per_week=3 trong Tuần 1, không cần bổ sung.

-- ============ BƯỚC 2: nhân bản Tuần 1 (đã đủ buổi) sang các tuần còn lại ============
-- Áp dụng chung cho MỌI kế hoạch có duration_week > 1 (lặp lại cùng 1 lịch mỗi tuần,
-- đúng với cách các phòng gym/app thương mại thiết kế mesocycle lặp lại theo tuần).

DELIMITER $$
CREATE PROCEDURE sp_expand_plan_weeks()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_day_id BIGINT;
    DECLARE v_plan_id BIGINT;
    DECLARE v_dow INT;
    DECLARE v_duration INT;
    DECLARE v_week INT;
    DECLARE v_new_day_id BIGINT;
    DECLARE v_max_day_in_num INT;

    DECLARE cur CURSOR FOR
        SELECT wd.id, wd.workout_plan_id, wd.day_of_week, wp.duration_week
        FROM workoutday wd
        JOIN workoutplan wp ON wp.id = wd.workout_plan_id
        WHERE wd.week_number = 1 AND wd.is_deleted = 0 AND wp.duration_week > 1
        ORDER BY wd.workout_plan_id, wd.day_in_number;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_day_id, v_plan_id, v_dow, v_duration;
        IF done THEN
            LEAVE read_loop;
        END IF;

        SET v_week = 2;
        WHILE v_week <= v_duration DO
            SELECT COALESCE(MAX(day_in_number), 0) + 1 INTO v_max_day_in_num
            FROM workoutday WHERE workout_plan_id = v_plan_id;

            INSERT INTO workoutday (workout_plan_id, day_of_week, day_in_number, week_number, is_deleted, created_at, updated_at)
            VALUES (v_plan_id, v_dow, v_max_day_in_num, v_week, 0, NOW(), NOW());
            SET v_new_day_id = LAST_INSERT_ID();

            INSERT INTO workoutday_exercises (workout_day_id, exercises_id, sets, reps, weight, duration, created_at, updated_at)
            SELECT v_new_day_id, exercises_id, sets, reps, weight, duration, NOW(), NOW()
            FROM workoutday_exercises WHERE workout_day_id = v_day_id;

            SET v_week = v_week + 1;
        END WHILE;
    END LOOP;
    CLOSE cur;
END$$
DELIMITER ;

CALL sp_expand_plan_weeks();
DROP PROCEDURE sp_expand_plan_weeks;
