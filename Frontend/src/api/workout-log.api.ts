import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import {
  WorkoutHistoryResponse,
  WorkoutLogHistoryRequest,
  WorkoutLogStatisticsResponse,
  WorkoutSessionDetail,
  WorkoutSessionSummary,
} from "@/types/history.type"
import { ExerciseProgress, LoggedExercise } from "@/types/progress.type"
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

export const getLoggedExercises = () => {
  return http.get<Response<LoggedExercise[]>>(API_ENDPOINTS.WORKOUT_LOGS.LOGGED_EXERCISES)
}

export const getExerciseProgress = (exerciseId: number) => {
  return http.get<Response<ExerciseProgress>>(
    API_ENDPOINTS.WORKOUT_LOGS.PROGRESS.replace(":exerciseId", String(exerciseId)),
  )
}

// fromDate/toDate: dd/MM/yyyy — danh sách buổi tập đã log (nhật ký tập luyện)
export const getWorkoutSessions = (fromDate?: string, toDate?: string) => {
  return http.get<Response<WorkoutSessionSummary[]>>(API_ENDPOINTS.WORKOUT_LOGS.SESSIONS, {
    params: { fromDate, toDate },
  })
}

// date: yyyy-MM-dd — chi tiết 1 buổi tập (từng bài, từng set target vs thực tế/AI nhận diện)
export const getWorkoutSessionDetail = (workoutDayId: number, date: string) => {
  return http.get<Response<WorkoutSessionDetail>>(API_ENDPOINTS.WORKOUT_LOGS.SESSION_DETAIL, {
    params: { workoutDayId, date },
  })
}
