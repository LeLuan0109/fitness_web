export type IngredientDetailResponse = {
  id: number
  name: string
  image: string
  standardUnit: string // VD: "g"
  standardUnitLabel: string // VD: "Gram (g)"
  caloriesPerUnit: number
}

export type GetIngredientsParams = {
  search?: string
  page?: number
  size?: number
}

export type IngredientRequest = {
  name: string
  standardUnit: string
  caloriesPerUnit: number
  image?: File
}
