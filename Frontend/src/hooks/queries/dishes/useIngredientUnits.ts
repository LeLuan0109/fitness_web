import { getIngredientUnits } from "@/api/dish.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Option, Response, ResponseError } from "@/types/common.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useIngredientUnits = () => {
  return useQuery<Response<Option[]>, AxiosError<ResponseError>, Option[]>({
    queryKey: [QUERY_KEYS.INGREDIENT_UNITS],
    queryFn: getIngredientUnits,
    select: (data) => data.data ?? [],
  })
}
