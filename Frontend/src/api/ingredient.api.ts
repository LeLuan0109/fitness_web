import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import type { Response } from "@/types/common.type"
import type { GetIngredientsParams, IngredientDetailResponse, IngredientRequest } from "@/types/ingredient.type"

export const getAllIngredients = (params?: GetIngredientsParams) => {
  return http.get<Response<IngredientDetailResponse[]>>(API_ENDPOINTS.INGREDIENTS.LIST, { params })
}

export const getIngredientById = (id: number) => {
  return http.get<Response<IngredientDetailResponse>>(API_ENDPOINTS.INGREDIENTS.DETAIL.replace(":id", id.toString()))
}

export const createIngredient = (data: IngredientRequest) => {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("standardUnit", data.standardUnit)
  formData.append("caloriesPerUnit", data.caloriesPerUnit.toString())

  if (data.image) {
    formData.append("image", data.image)
  }

  return http.post<Response<IngredientDetailResponse>>(API_ENDPOINTS.INGREDIENTS.CREATE, {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updateIngredient = (id: number, data: IngredientRequest) => {
  const formData = new FormData()
  formData.append("name", data.name)
  formData.append("standardUnit", data.standardUnit)
  formData.append("caloriesPerUnit", data.caloriesPerUnit.toString())

  if (data.image) {
    formData.append("image", data.image)
  }

  return http.put<Response<IngredientDetailResponse>>(API_ENDPOINTS.INGREDIENTS.UPDATE.replace(":id", id.toString()), {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const getIngredientUnits = () => {
  return http.get<Response<{ value: string; label: string }[]>>(API_ENDPOINTS.INGREDIENTS.UNIT)
}
