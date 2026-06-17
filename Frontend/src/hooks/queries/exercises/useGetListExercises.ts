import { getListExercises } from "@/api/exercises.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ExerciseResponse, ExerciseSearchParams, ExercisesListData } from "@/types/exercises.type"
import { transformExercisesListData } from "@/utils/exercises.util"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetListExercises = (params: ExerciseSearchParams) => {
  return useQuery<Response<ExerciseResponse[]>, AxiosError<ResponseError>, ExercisesListData>({
    queryKey: [QUERY_KEYS.EXERCISES_LIST, params],
    queryFn: () => getListExercises(params),
    select: transformExercisesListData,
  })
}
