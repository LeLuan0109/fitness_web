import { getWorkoutLogStatistics } from "@/api/workout-log.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { WorkoutLogStatisticsResponse } from "@/types/history.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetWorkoutLogStatistics = () => {
  return useQuery<Response<WorkoutLogStatisticsResponse>, AxiosError<ResponseError>, WorkoutLogStatisticsResponse>({
    queryKey: [QUERY_KEYS.WORKOUT_LOG.STATS],
    queryFn: () => getWorkoutLogStatistics(),
    select: (data) => data?.data,
  })
}
