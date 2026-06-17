import { getMyPlans } from "@/api/workout-plan.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { PlanListData, PlanListResponse, WorkoutPlanSearchParams } from "@/types/workout-plan.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetMyPlans = (params: WorkoutPlanSearchParams) => {
  return useQuery<Response<PlanListResponse[]>, AxiosError<ResponseError>, PlanListData>({
    queryKey: [QUERY_KEYS.MY_PLANS, params],
    queryFn: () => getMyPlans(params),
    enabled: !!params,
    select: (data) => ({
      data: data?.data ?? [],
      pagination: data?.meta,
    }),
  })
}
