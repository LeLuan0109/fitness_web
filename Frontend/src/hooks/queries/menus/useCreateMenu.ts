import { createMenu } from "@/api/menu.api"
import { Response, ResponseError } from "@/types/common.type"
import { MenuRequest, MenuResponse } from "@/types/meal.type"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useCreateMenu = () => {
  return useMutation<Response<MenuResponse>, AxiosError<ResponseError>, MenuRequest>({
    mutationFn: (data: MenuRequest) => createMenu(data),
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Tạo thực đơn thất bại"
      toast.error(errorMessage)
    },
  })
}
