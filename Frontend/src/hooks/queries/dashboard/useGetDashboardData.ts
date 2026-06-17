import { getDashboardData } from "@/api/dashboard.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { DashboardResponse } from "@/types/dashboard.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetDashboardData = (userId: string) => {
  return useQuery<Response<DashboardResponse>, AxiosError<ResponseError>, DashboardResponse>({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: () => getDashboardData(userId),
    select: (data) => data?.data,
  })
}
