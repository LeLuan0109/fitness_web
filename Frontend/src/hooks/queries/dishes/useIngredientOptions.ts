import { getIngredientSelectOptions } from "@/api/dish.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Option, Response, ResponseError } from "@/types/common.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useIngredientOptions = () => {
  return useQuery<Response<Option[]>, AxiosError<ResponseError>, Option[]>({
    queryKey: [QUERY_KEYS.INGREDIENT_OPTIONS],
    queryFn: getIngredientSelectOptions,
    select: (data) => data.data ?? [],
  })
}
