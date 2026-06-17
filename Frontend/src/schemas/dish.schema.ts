import { vStringRequired } from "@/constants/validates"
import z from "zod"

const dishIngredientSchema = z.object({
  ingredientId: z.number().min(1, "Vui lòng chọn nguyên liệu"),
  quantity: z.number().min(0.1, "Số lượng phải lớn hơn 0"),
  unit: vStringRequired("Đơn vị"),
  preparationNote: z.string().optional(),
})

export const DishFormSchema = z.object({
  name: vStringRequired("Tên món ăn"),
  cookingTime: z.number().min(1, "Thời gian nấu phải lớn hơn 0"),
  calories: z.number().min(0, "Calories không được âm"),
  protein: z.number().min(0, "Protein không được âm"),
  fat: z.number().min(0, "Chất béo không được âm"),
  carbs: z.number().min(0, "Carbohydrate không được âm"),
  preparation: vStringRequired("Cách chế biến"),
  image: z.any().optional(),
  ingredients: z.array(dishIngredientSchema).min(1, "Món ăn phải có ít nhất 1 nguyên liệu"),
})

export type DishFormData = z.infer<typeof DishFormSchema>
export type DishIngredientFormData = z.infer<typeof dishIngredientSchema>
