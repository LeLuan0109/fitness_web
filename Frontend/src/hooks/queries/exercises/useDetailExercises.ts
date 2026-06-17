import { getDetailExercise } from "@/api/exercises.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ExerciseResponse } from "@/types/exercises.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useDetailExercises = (id: string | undefined) => {
  return useQuery<Response<ExerciseResponse | null>, AxiosError<ResponseError>, ExerciseResponse | null>({
    queryKey: [QUERY_KEYS.EXERCISE_DETAIL, id],
    queryFn: () => getDetailExercise(id),
    enabled: !!id,
    select: (data) => data.data ?? null,
  })
}
