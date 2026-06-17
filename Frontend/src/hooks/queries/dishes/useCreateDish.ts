import { createDish } from "@/api/dish.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { DishRequest } from "@/types/dish.type"
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"

export const useCreateDish = (options?: UseMutationOptions<any, Error, DishRequest>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDish,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DISHES.LIST] })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}
