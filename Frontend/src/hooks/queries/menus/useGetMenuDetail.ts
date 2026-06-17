import { getMenuDetail } from "@/api/menu.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { MenuResponse } from "@/types/meal.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetMenuDetail = (id: string | number) => {
  return useQuery<Response<MenuResponse>, AxiosError<ResponseError>, MenuResponse>({
    queryKey: [QUERY_KEYS.MENUS.DETAIL, id],
    queryFn: () => getMenuDetail(id),
    select: (response) => response?.data as MenuResponse,
    enabled: !!id,
  })
}
