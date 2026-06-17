import { getRelatedExercises } from "@/api/exercises.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ExerciseData, ExerciseResponse } from "@/types/exercises.type"
import { transformExerciseData } from "@/utils/exercises.util"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetRelatedExercise = (id: string) => {
  return useQuery<Response<ExerciseResponse[]>, AxiosError<ResponseError>, ExerciseData[]>({
    queryKey: [QUERY_KEYS.EXERCISE_RELATED, id],
    queryFn: () => getRelatedExercises(id),
    enabled: !!id,
    select: transformExerciseData,
  })
}
