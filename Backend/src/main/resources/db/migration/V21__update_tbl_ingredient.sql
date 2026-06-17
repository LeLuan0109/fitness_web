UPDATE ingredients
SET standard_unit = 'g'
WHERE standard_unit = 'gram';

-- 2. Cập nhật 'quả' thành 'cái'
UPDATE ingredients
SET standard_unit = 'cái'
WHERE standard_unit = 'quả';

UPDATE ingredients
SET standard_unit = TRIM(standard_unit);