import { getDishes } from "@/api/dish.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { DishListData, DishListItem, DishSearchParams } from "@/types/dish.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useDishesList = (params?: DishSearchParams) => {
  return useQuery<Response<DishListItem[]>, AxiosError<ResponseError>, DishListData>({
    queryKey: [QUERY_KEYS.DISHES.LIST, params],
    queryFn: () => getDishes(params),
    select: (response) => {
      return {
        data: response.data ?? [],
        pagination: response.meta,
      }
    },
  })
}
