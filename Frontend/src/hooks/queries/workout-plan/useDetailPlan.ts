import { getWorkoutPlanDetail } from "@/api/workout-plan.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { PlanDetailResponse } from "@/types/workout-plan.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useDetailPlan = (id: string) => {
  return useQuery<Response<PlanDetailResponse>, AxiosError<ResponseError>, PlanDetailResponse>({
    queryKey: [QUERY_KEYS.WORKOUT_PLAN_DETAIL, id],
    queryFn: () => getWorkoutPlanDetail(id),
    enabled: !!id,
    select: (data) => data?.data,
    structuralSharing: false,
  })
}
