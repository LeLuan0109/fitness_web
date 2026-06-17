import { updateDish } from "@/api/dish.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { DishRequest } from "@/types/dish.type"
import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query"

type UpdateDishParams = {
  id: string
  data: DishRequest
}

export const useUpdateDish = (options?: UseMutationOptions<any, Error, UpdateDishParams>) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateDishParams) => updateDish(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DISHES.LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DISHES.DETAIL] })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}
