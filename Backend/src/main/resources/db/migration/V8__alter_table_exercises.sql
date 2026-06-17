CREATE TABLE IF NOT EXISTS `exercise_step` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `instruction` TEXT NULL,
    `step_order` INT NULL,
    `exercise_id` BIGINT NULL,

    CONSTRAINT `fk_exercise_step_exercises`
    FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `exercise_tip` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT NULL,
    `exercise_id` BIGINT NULL,

    CONSTRAINT `fk_exercise_tip_exercises`
    FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `exercise_benefit` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT NULL,
    `exercise_id` BIGINT NULL,

    CONSTRAINT `fk_exercise_benefit_exercises`
    FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `exercise_mistake` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `content` TEXT NULL,
    `exercise_id` BIGINT NULL,

    CONSTRAINT `fk_exercise_mistake_exercises`
    FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `exercise_equipment` (
    `exercise_id` BIGINT NOT NULL,
    `equipment_id` BIGINT NOT NULL,

    PRIMARY KEY (`exercise_id`, `equipment_id`),

    CONSTRAINT `fk_ex_eq_exercises`
    FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`),

    CONSTRAINT `fk_ex_eq_equipment`
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `exercises` DROP COLUMN `tips`;
ALTER TABLE `exercises` DROP COLUMN `benefit`;
ALTER TABLE `exercises` DROP COLUMN `preparation`;