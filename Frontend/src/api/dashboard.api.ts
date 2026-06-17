import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import { ChartResponse, DashboardResponse, DashboardStatsResponse } from "@/types/dashboard.type"

export const getDashboardData = (userId: string) => {
  return http.get<Response<DashboardResponse>>(API_ENDPOINTS.DASHBOARD.replace(":userId", userId))
}

export const getAdminDashboardStats = () => {
  return http.get<Response<DashboardStatsResponse>>(API_ENDPOINTS.ADMIN_DASHBOARD.STATS)
}

export const getUserGrowthChart = (year?: number) => {
  return http.get<Response<ChartResponse[]>>(API_ENDPOINTS.ADMIN_DASHBOARD.USER_GROWTH, {
    params: {
      year,
    },
  })
}

export const getUserGoalChart = () => {
  return http.get<Response<ChartResponse[]>>(API_ENDPOINTS.ADMIN_DASHBOARD.USER_GOAL)
}
