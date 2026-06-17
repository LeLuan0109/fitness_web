import { getSampleMenu } from "@/api/menu.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { MenuListResponse, MenuSearhParams } from "@/types/meal.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetSampleMenu = (params?: MenuSearhParams) => {
  return useQuery<Response<MenuListResponse[]>, AxiosError<ResponseError>>({
    queryKey: [QUERY_KEYS.MENUS.SAMPLE, params],
    queryFn: () => getSampleMenu(params),
  })
}
