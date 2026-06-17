import { getAdminDashboardStats, getUserGrowthChart, getUserGoalChart } from "@/api/dashboard.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ChartResponse, DashboardStatsResponse } from "@/types/dashboard.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetAdminDashboardStats = () => {
  return useQuery<Response<DashboardStatsResponse>, AxiosError<ResponseError>, DashboardStatsResponse>({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD.STATS],
    queryFn: () => getAdminDashboardStats(),
    select: (data) => data?.data,
  })
}

export const useGetUserGrowthChart = (year?: number) => {
  return useQuery<Response<ChartResponse[]>, AxiosError<ResponseError>, ChartResponse[]>({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD.USER_GROWTH, year],
    queryFn: () => getUserGrowthChart(year),
    select: (data) => data?.data,
  })
}

export const useGetUserGoalChart = () => {
  return useQuery<Response<ChartResponse[]>, AxiosError<ResponseError>, ChartResponse[]>({
    queryKey: [QUERY_KEYS.ADMIN_DASHBOARD.USER_GOAL],
    queryFn: () => getUserGoalChart(),
    select: (data) => data?.data,
  })
}

export const useGetAdminDashboardData = (year?: number) => {
  const statsQuery = useGetAdminDashboardStats()
  const userGrowthQuery = useGetUserGrowthChart(year)
  const userGoalQuery = useGetUserGoalChart()

  return {
    stats: statsQuery.data,
    userGrowth: userGrowthQuery.data,
    userGoal: userGoalQuery.data,
    isLoading: statsQuery.isLoading || userGrowthQuery.isLoading || userGoalQuery.isLoading,
    isError: statsQuery.isError || userGrowthQuery.isError || userGoalQuery.isError,
    error: statsQuery.error || userGrowthQuery.error || userGoalQuery.error,
  }
}
