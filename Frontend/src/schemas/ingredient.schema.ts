import { vStringRequired } from "@/constants/validates"
import z from "zod"

export const IngredientFormSchema = z.object({
  name: vStringRequired("Tên nguyên liệu"),
  standardUnit: vStringRequired("Đơn vị chuẩn"),
  caloriesPerUnit: z.number().min(0, "Calo phải lớn hơn hoặc bằng 0"),
  image: z.any().optional(),
})

export type IngredientFormData = z.infer<typeof IngredientFormSchema>
