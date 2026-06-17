RENAME TABLE `exercises_musclegroup` TO `exercise_muscle_group`;

ALTER TABLE `exercise_muscle_group`
CHANGE COLUMN `exercises_id` `exercise_id` BIGINT NOT NULL;

ALTER TABLE `exercise_muscle_group`
ADD COLUMN `id` BIGINT AUTO_INCREMENT PRIMARY KEY FIRST;