ALTER TABLE `workoutday`
ADD COLUMN `week_number` INT NOT NULL DEFAULT 1;

ALTER TABLE `workoutday_exercises`
ADD COLUMN `sets` INT NULL;

ALTER TABLE `workoutday_exercises`
MODIFY COLUMN `reps` INT NULL,
MODIFY COLUMN `weight` INT NULL,
MODIFY COLUMN `duration` INT NULL;

ALTER TABLE `workoutplan`CHANGE COLUMN `workout_week` `days_per_week` INT NULL