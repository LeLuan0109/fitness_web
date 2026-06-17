import { getIngredientById } from "@/api/ingredient.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { IngredientDetailResponse } from "@/types/ingredient.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetIngredientDetail = (id: string) => {
  return useQuery<Response<IngredientDetailResponse>, AxiosError<ResponseError>, IngredientDetailResponse>({
    queryKey: [QUERY_KEYS.INGREDIENTS.DETAIL, id],
    queryFn: () => getIngredientById(Number(id)),
    enabled: !!id,
    select: (data) => data?.data ?? null,
  })
}
