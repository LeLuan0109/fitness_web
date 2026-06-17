import { createExercise } from "@/api/exercises.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { ExerciseRequest, ExerciseResponse } from "@/types/exercises.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useCreateExercise = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<ExerciseResponse>, AxiosError<ResponseError>, ExerciseRequest>({
    mutationFn: createExercise,
    onSuccess: () => {
      // Invalidate exercises list to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXERCISES_LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXERCISE_OPTIONS],
      })
    },
  })
}
