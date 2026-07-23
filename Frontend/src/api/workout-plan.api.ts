import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import {
  PlanDetailResponse,
  PlanListResponse,
  WorkoutPlanRequest,
  WorkoutPlanSearchParams,
} from "@/types/workout-plan.type"
import { generatePath } from "react-router"

export const getSamplePlans = (params: WorkoutPlanSearchParams) => {
  return http.get<Response<PlanListResponse[]>>(API_ENDPOINTS.WORKOUT_PLANS.SAMPLE, { params })
}

export const getMyPlans = (params: WorkoutPlanSearchParams) => {
  return http.get<Response<PlanListResponse[]>>(API_ENDPOINTS.WORKOUT_PLANS.MINE, { params })
}

export const getWorkoutPlanDetail = (id: string) => {
  return http.get<Response<PlanDetailResponse>>(generatePath(API_ENDPOINTS.WORKOUT_PLANS.DETAIL, { id }))
}

export const getOutstandingPlans = () => {
  return http.get<Response<PlanListResponse[]>>(API_ENDPOINTS.WORKOUT_PLANS.OUTSTANDING)
}

export const deleteWorkoutPlan = (id: string) => {
  return http.delete<Response<boolean>>(generatePath(API_ENDPOINTS.WORKOUT_PLANS.DELETE, { id }))
}

export const copyWorkoutPlan = (id: string) => {
  return http.post<Response<string>>(generatePath(API_ENDPOINTS.WORKOUT_PLANS.COPY, { id }))
}

export const createWorkoutPlan = (data: WorkoutPlanRequest) => {
  return http.post<Response<number>>(API_ENDPOINTS.WORKOUT_PLANS.CREATE, { data })
}

export type PlanLabelSuggestion = {
  suggestedDifficulty: string
  daysPerWeek: number
  estimatedDurationMinutes: number
  requiredEquipment: string[]
  muscleGroups: string[]
  difficultyReasoning: string[]
}

// Đề xuất nhãn (độ khó, buổi/tuần, thời lượng...) từ lịch tập đang soạn — người tạo có thể giữ hoặc đổi.
export const suggestPlanLabels = (schedule: WorkoutPlanRequest["schedule"]) => {
  return http.post<Response<PlanLabelSuggestion>>(API_ENDPOINTS.WORKOUT_PLANS.SUGGEST_LABELS, {
    data: { schedule },
  })
}

export const updateWorkoutPlan = (id: string, data: WorkoutPlanRequest) => {
  return http.put<Response<number>>(generatePath(API_ENDPOINTS.WORKOUT_PLANS.UPDATE, { id }), { data })
}
