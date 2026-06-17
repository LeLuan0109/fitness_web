import { getDishes } from "@/api/dish.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { DishListItem, DishSearchParams } from "@/types/dish.type"
import { useInfiniteQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useDishesInfiniteList = (params?: Omit<DishSearchParams, "page">) => {
  // Filter out empty search params
  const cleanParams = params
    ? Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== "" && value != null))
    : {}

  return useInfiniteQuery<Response<DishListItem[]>, AxiosError<ResponseError>>({
    queryKey: [QUERY_KEYS.DISHES.LIST, "infinite", cleanParams],
    queryFn: ({ pageParam = 1 }) => getDishes({ ...cleanParams, page: pageParam as number }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined
      const { page, hasMore } = lastPage.meta
      return hasMore ? page + 1 : undefined
    },
    initialPageParam: 0,
  })
}
