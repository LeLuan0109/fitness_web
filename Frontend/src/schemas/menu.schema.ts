import { z } from "zod"

export const mealDishSchema = z.object({
  dishId: z.number().positive("ID món ăn phải là số dương"),
  quantity: z.number().positive("Số lượng phải lớn hơn 0"),
})

export const mealSchema = z.object({
  name: z.enum(["BREAKFAST", "LUNCH", "DINNER", "EXTRA"], {
    required_error: "Tên bữa ăn là bắt buộc",
  }),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER", "EXTRA"], {
    required_error: "Loại bữa ăn là bắt buộc",
  }),
  dishes: z.array(mealDishSchema).min(1, "Mỗi bữa ăn phải có ít nhất 1 món"),
})

export const menuSchema = z.object({
  name: z.string().min(1, "Tên thực đơn là bắt buộc").max(255, "Tên thực đơn không được quá 255 ký tự"),
  description: z.string().max(1000, "Mô tả không được quá 1000 ký tự").optional(),
  fitnessGoal: z.enum(["LOSE_WEIGHT", "GAIN_WEIGHT", "MUSCLE_GAIN", "SHAPE_BODY", "OTHERS"], {
    required_error: "Mục tiêu là bắt buộc",
  }),
  meals: z.array(mealSchema).min(1, "Thực đơn phải có ít nhất 1 bữa ăn"),
})

export type MenuFormData = z.infer<typeof menuSchema>
export type MealFormData = z.infer<typeof mealSchema>
export type MealDishFormData = z.infer<typeof mealDishSchema>
