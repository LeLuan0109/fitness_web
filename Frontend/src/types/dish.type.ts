import { Pagination } from "./common.type"

export type IngredientResponse = {
  id: number
  name: string
  image: string
  standardUnit: string
  caloriesPerUnit: number
}

export type DishIngredientResponse = {
  id: number
  quantity: number
  unit: string
  preparationNote: string
  ingredient: IngredientResponse
}

export type DishIngredient = {
  ingredientId: number
  ingredientName?: string
  quantity: number
  unit: string
  preparationNote?: string
}

export type DishRequest = {
  name: string
  cookingTime: number
  calories: number
  protein: number
  fat: number
  carbs: number
  preparation: string
  image?: File
  ingredients: DishIngredient[]
}

export type DishResponse = {
  id: number
  name: string
  cookingTime: number
  calories: number
  protein: number
  fat: number
  carbs: number
  preparation: string
  image: string
  ingredients: DishIngredientResponse[]
}

export type DishListItem = {
  id: number
  name: string
  cookingTime: number
  image: string
  calories: number
  protein: number
  fat: number
  carbs: number
  ingredients: DishIngredientResponse[]
  preparation: string
}

export type DishSearchParams = {
  search?: string
  cookingTime?: number
  page?: number
  size?: number
}

export type Ingredient = {
  id: number
  name: string
  unit: string
}

export type DishListData = {
  data: DishListItem[]
  pagination: Pagination
}
