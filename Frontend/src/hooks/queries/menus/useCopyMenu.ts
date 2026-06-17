import { copyMenu } from "@/api/menu.api"
import { Response, ResponseError } from "@/types/common.type"
import { MenuResponse } from "@/types/meal.type"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useCopyMenu = () => {
  return useMutation<Response<MenuResponse>, AxiosError<ResponseError>, string | number>({
    mutationFn: (id: string | number) => copyMenu(id),
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Sao chép thực đơn thất bại"
      toast.error(errorMessage)
    },
  })
}
