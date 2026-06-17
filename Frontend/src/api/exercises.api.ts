import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Option, Response } from "@/types/common.type"
import {
  ExerciseDetailFormResponse,
  ExerciseRequest,
  ExerciseResponse,
  ExerciseSearchParams,
} from "@/types/exercises.type"
import { generatePath } from "react-router"

export const getListExercises = (params: ExerciseSearchParams) => {
  return http.get<Response<ExerciseResponse[]>>(API_ENDPOINTS.EXERCISE.LIST, { params })
}

export const getDetailExercise = (id: string) => {
  return http.get<Response<ExerciseResponse>>(generatePath(API_ENDPOINTS.EXERCISE.DETAIL, { id }))
}

export const getdetailFormExercise = (id: string) => {
  return http.get<Response<ExerciseDetailFormResponse>>(generatePath(API_ENDPOINTS.EXERCISE.DETAIL_FORM, { id }))
}

export const getRelatedExercises = (id: string) => {
  return http.get<Response<ExerciseResponse[]>>(generatePath(API_ENDPOINTS.EXERCISE.RELATED, { id }))
}

export const getExerciseSelectOptions = () => {
  return http.get<Response<Option[]>>(API_ENDPOINTS.EXERCISE.SELECT_OPTIONS)
}

export const createExercise = (data: ExerciseRequest) => {
  const formData = new FormData()

  formData.append("name", data.name)
  formData.append("level", data.level)
  formData.append("description", data.description)
  formData.append("trainingTypeId", data.trainingTypeId.toString())
  formData.append("met", data.met.toString())

  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail)
  }

  if (data.video) {
    formData.append("video", data.video)
  }

  data.equipmentIds.forEach((id) => formData.append("equipmentIds", id.toString()))
  data.primaryMuscleGroupIds.forEach((id) => formData.append("primaryMuscleGroupIds", id.toString()))
  data.secondaryMuscleGroupIds.forEach((id) => formData.append("secondaryMuscleGroupIds", id.toString()))
  data.steps.forEach((step) => formData.append("steps", step))
  data.tips.forEach((tip) => formData.append("tips", tip))
  data.mistakes.forEach((mistake) => formData.append("mistakes", mistake))
  data.benefits.forEach((benefit) => formData.append("benefits", benefit))

  return http.post<Response<ExerciseResponse>>(API_ENDPOINTS.EXERCISE.LIST, {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const updateExercise = (id: string, data: ExerciseRequest) => {
  const formData = new FormData()

  formData.append("name", data.name)
  formData.append("level", data.level)
  formData.append("description", data.description)
  formData.append("trainingTypeId", data.trainingTypeId.toString())
  formData.append("met", data.met.toString())

  if (data.thumbnail) {
    formData.append("thumbnail", data.thumbnail)
  }

  if (data.video) {
    formData.append("video", data.video)
  }

  data.equipmentIds.forEach((id) => formData.append("equipmentIds", id.toString()))
  data.primaryMuscleGroupIds.forEach((id) => formData.append("primaryMuscleGroupIds", id.toString()))
  data.secondaryMuscleGroupIds.forEach((id) => formData.append("secondaryMuscleGroupIds", id.toString()))
  data.steps.forEach((step) => formData.append("steps", step))
  data.tips.forEach((tip) => formData.append("tips", tip))
  data.mistakes.forEach((mistake) => formData.append("mistakes", mistake))
  data.benefits.forEach((benefit) => formData.append("benefits", benefit))

  return http.put<Response<ExerciseResponse>>(generatePath(API_ENDPOINTS.EXERCISE.DETAIL, { id }), {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const deleteExercise = (id: string) => {
  return http.delete<Response<void>>(generatePath(API_ENDPOINTS.EXERCISE.DELETE, { id }))
}
