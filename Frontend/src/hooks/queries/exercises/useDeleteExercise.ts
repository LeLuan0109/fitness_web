import { deleteExercise } from "@/api/exercises.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useDeleteExercise = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<void>, AxiosError<ResponseError>, string>({
    mutationFn: deleteExercise,
    onSuccess: (_, id) => {
      // Invalidate exercises list to refetch
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXERCISES_LIST],
      })
      // Remove the specific exercise detail from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.EXERCISE_DETAIL, id],
      })
      // Remove related exercises from cache
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.EXERCISE_RELATED, id],
      })
      // Invalidate exercise options
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXERCISE_OPTIONS],
      })
    },
  })
}
