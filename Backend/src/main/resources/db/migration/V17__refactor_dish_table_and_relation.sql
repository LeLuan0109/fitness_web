-- Tạo bảng Ingredients
CREATE TABLE  IF NOT EXISTS ingredients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255),
    standard_unit VARCHAR(50),
    calories_per_unit FLOAT
);

CREATE TABLE  IF NOT EXISTS dish_ingredients  (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dish_id BIGINT NOT NULL,
    ingredient_id BIGINT NOT NULL,
    quantity FLOAT,
    unit VARCHAR(50),
    preparation_note VARCHAR(255),

    CONSTRAINT fk_dish_ingredients_dish
        FOREIGN KEY (dish_id) REFERENCES dishes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_dish_ingredients_ingredient
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
        ON DELETE RESTRICT
);

ALTER TABLE dishes
    -- Thêm cột mới
    ADD COLUMN cooking_duration_minutes INT,

    RENAME COLUMN avatar TO image,

    -- Xóa các cột không dùng nữa
    DROP COLUMN modeling_duration ,
    DROP COLUMN ingredients;
--    DROP COLUMN meal_type_id;

ALTER TABLE meal drop FOREIGN KEY FK_Meal_MealType;

ALTER TABLE meal drop column meal_type_id;

DROP TABLE mealtype;
