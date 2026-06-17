import { updateExercise } from "@/api/exercises.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ExerciseRequest, ExerciseResponse } from "@/types/exercises.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

interface UpdateExerciseVariables {
  id: string
  data: ExerciseRequest
}

export const useUpdateExercise = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<ExerciseResponse>, AxiosError<ResponseError>, UpdateExerciseVariables>({
    mutationFn: ({ id, data }) => updateExercise(id, data),
    onSuccess: (_, variables) => {
      // Invalidate exercises list to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXERCISES_LIST],
      })
      // Invalidate the specific exercise detail
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXERCISE_DETAIL, variables.id],
      })
      // Invalidate related exercises
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXERCISE_RELATED, variables.id],
      })
      // Invalidate exercise options
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXERCISE_OPTIONS],
      })
    },
  })
}
