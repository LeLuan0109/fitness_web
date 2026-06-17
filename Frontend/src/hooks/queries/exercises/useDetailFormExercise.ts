import { getdetailFormExercise } from "@/api/exercises.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ExerciseDetailFormResponse } from "@/types/exercises.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useDetailFormExercise = (id: string) => {
  return useQuery<
    Response<ExerciseDetailFormResponse | null>,
    AxiosError<ResponseError>,
    ExerciseDetailFormResponse | null
  >({
    queryKey: [QUERY_KEYS.EXERCISES.DETAIL_FROM, id],
    queryFn: () => getdetailFormExercise(id),
    enabled: !!id,
    select: (data) => data.data ?? null,
  })
}
