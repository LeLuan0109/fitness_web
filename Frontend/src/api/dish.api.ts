import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Option, Response } from "@/types/common.type"
import { DishListItem, DishRequest, DishResponse, DishSearchParams } from "@/types/dish.type"
import { generatePath } from "react-router"

export const getDishes = (params?: DishSearchParams) => {
  return http.get<Response<DishListItem[]>>(API_ENDPOINTS.DISHES.LIST, { params })
}

export const createDish = (data: DishRequest) => {
  const formData = new FormData()

  formData.append("name", data.name)
  formData.append("cookingTime", data.cookingTime.toString())
  formData.append("calories", data.calories.toString())
  formData.append("protein", data.protein.toString())
  formData.append("fat", data.fat.toString())
  formData.append("carbs", data.carbs.toString())
  formData.append("preparation", data.preparation)

  if (data.image) {
    formData.append("image", data.image)
  }

  // Append ingredients array
  data.ingredients.forEach((ingredient, index) => {
    formData.append(`ingredients[${index}].ingredientId`, ingredient.ingredientId.toString())
    formData.append(`ingredients[${index}].quantity`, ingredient.quantity.toString())
    formData.append(`ingredients[${index}].unit`, ingredient.unit)
    if (ingredient.preparationNote) {
      formData.append(`ingredients[${index}].preparationNote`, ingredient.preparationNote)
    }
  })

  return http.post<Response<number>>(API_ENDPOINTS.DISHES.CREATE, {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updateDish = (id: string, data: DishRequest) => {
  const formData = new FormData()

  formData.append("name", data.name)
  formData.append("cookingTime", data.cookingTime.toString())
  formData.append("calories", data.calories.toString())
  formData.append("protein", data.protein.toString())
  formData.append("fat", data.fat.toString())
  formData.append("carbs", data.carbs.toString())
  formData.append("preparation", data.preparation)

  if (data.image) {
    formData.append("image", data.image)
  }

  // Append ingredients array
  data.ingredients.forEach((ingredient, index) => {
    formData.append(`ingredients[${index}].ingredientId`, ingredient.ingredientId.toString())
    formData.append(`ingredients[${index}].quantity`, ingredient.quantity.toString())
    formData.append(`ingredients[${index}].unit`, ingredient.unit)
    if (ingredient.preparationNote) {
      formData.append(`ingredients[${index}].preparationNote`, ingredient.preparationNote)
    }
  })

  return http.put<Response<number>>(generatePath(API_ENDPOINTS.DISHES.UPDATE, { id }), {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const getDishDetail = (id: string) => {
  return http.get<Response<DishResponse>>(generatePath(API_ENDPOINTS.DISHES.DETAIL, { id }))
}

export const deleteDish = (id: string) => {
  return http.delete<Response<void>>(generatePath(API_ENDPOINTS.DISHES.DELETE, { id }))
}

export const getIngredientSelectOptions = () => {
  return http.get<Response<Option[]>>(API_ENDPOINTS.INGREDIENTS.SELECT_OPTIONS)
}

export const getIngredientUnits = () => {
  return http.get<Response<Option[]>>(API_ENDPOINTS.INGREDIENTS.UNIT)
}
