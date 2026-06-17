import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import { WorkoutHistoryResponse, WorkoutLogHistoryRequest, WorkoutLogStatisticsResponse } from "@/types/history.type"
import { LogSetRequest } from "@/types/workout-log.type"

export const logWorkoutSet = (data: LogSetRequest) => {
  return http.post<Response<boolean>>(API_ENDPOINTS.WORKOUT_LOGS.LOG_SET, { data })
}

export const getWorkoutLogStatistics = () => {
  return http.get<Response<WorkoutLogStatisticsResponse>>(API_ENDPOINTS.WORKOUT_LOGS.STATS)
}

export const getWorkoutLogHistory = (params: WorkoutLogHistoryRequest) => {
  return http.get<Response<WorkoutHistoryResponse[]>>(API_ENDPOINTS.WORKOUT_LOGS.HISTORY, { params })
}
