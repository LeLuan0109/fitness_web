import { getExerciseSelectOptions } from "@/api/exercises.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Option, Response, ResponseError } from "@/types/common.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetExerciseOptions = () => {
  return useQuery<Response<Option[]>, AxiosError<ResponseError>, Option[]>({
    queryKey: [QUERY_KEYS.EXERCISE_OPTIONS],
    queryFn: getExerciseSelectOptions,
    select: (data) => data.data ?? [],
  })
}
