-- Nhật ký ăn uống: mỗi dòng là một món đã ăn trong một ngày (tính macro theo ngày).
CREATE TABLE IF NOT EXISTS food_log (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    dish_id     BIGINT       NOT NULL,
    quantity    INT          NOT NULL DEFAULT 1,
    log_date    DATE         NOT NULL,
    meal_type   VARCHAR(50)  DEFAULT 'OTHER',
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_foodlog_user FOREIGN KEY (user_id) REFERENCES user (id),
    CONSTRAINT fk_foodlog_dish FOREIGN KEY (dish_id) REFERENCES dishes (id)
);

CREATE INDEX idx_foodlog_user_date ON food_log (user_id, log_date);
