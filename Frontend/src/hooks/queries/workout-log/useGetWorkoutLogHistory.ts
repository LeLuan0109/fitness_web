import { getWorkoutLogHistory } from "@/api/workout-log.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { WorkoutHistoryResponse, WorkoutLogHistoryRequest } from "@/types/history.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetWorkoutLogHistory = (params?: WorkoutLogHistoryRequest) => {
  return useQuery<Response<WorkoutHistoryResponse[]>, AxiosError<ResponseError>, WorkoutHistoryResponse[]>({
    queryKey: [QUERY_KEYS.WORKOUT_LOG.HISTORY, params],
    queryFn: () => getWorkoutLogHistory(params),
    enabled: !!params,
    select: (data) => data?.data,
  })
}
