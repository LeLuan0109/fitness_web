import { updateMenu } from "@/api/menu.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { MenuRequest, MenuResponse } from "@/types/meal.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useUpdateMenu = (id: string | number) => {
  const queryClient = useQueryClient()

  return useMutation<Response<MenuResponse>, AxiosError<ResponseError>, MenuRequest>({
    mutationFn: (data: MenuRequest) => updateMenu(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENUS.DETAIL, id] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || "Cập nhật thực đơn thất bại")
    },
  })
}
