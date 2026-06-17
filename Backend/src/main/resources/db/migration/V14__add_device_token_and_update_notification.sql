CREATE TABLE `user_device_token` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) NOT NULL,
    `device_type` VARCHAR(50) NULL,
    `user_id` BIGINT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_user_device_token_token` UNIQUE (`token`),
    CONSTRAINT `fk_user_device_token_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

ALTER TABLE `notification`
ADD COLUMN `reference_id` BIGINT NULL COMMENT 'ID của đối tượng liên quan (Post, Plan...)',
ADD COLUMN `reference_url` VARCHAR(255) NULL COMMENT 'Link điều hướng Frontend';