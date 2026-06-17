import { DishFormData } from "@/schemas/dish.schema"

export const DEFAULT_DISH_FORM: DishFormData = {
  name: "",
  cookingTime: 30,
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  preparation: "",
  ingredients: [
    {
      ingredientId: 0,
      quantity: 0,
      unit: "",
      preparationNote: "",
    },
  ],
}
