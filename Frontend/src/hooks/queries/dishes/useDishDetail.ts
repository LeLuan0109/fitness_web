import { getDishDetail } from "@/api/dish.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { DishResponse } from "@/types/dish.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useDishDetail = (id?: string) => {
  return useQuery<Response<DishResponse>, AxiosError<ResponseError>, DishResponse | null>({
    queryKey: [QUERY_KEYS.DISHES.DETAIL, id],
    queryFn: () => getDishDetail(id!),
    enabled: !!id,
    select: (data) => data.data ?? null,
  })
}
