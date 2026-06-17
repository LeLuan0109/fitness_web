import { getOutstandingPlans } from "@/api/workout-plan.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { PlanListResponse } from "@/types/workout-plan.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetOutstandingPlans = () => {
  return useQuery<Response<PlanListResponse[]>, AxiosError<ResponseError>, PlanListResponse[]>({
    queryKey: [QUERY_KEYS.OUTSTANDING_PLANS],
    queryFn: getOutstandingPlans,
    select: (data) => data?.data ?? [],
  })
}
