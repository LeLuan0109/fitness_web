import { deleteMenu } from "@/api/menu.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useDeleteMenu = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<void>, AxiosError<ResponseError>, string | number>({
    mutationFn: (id: string | number) => deleteMenu(id),
    onSuccess: () => {
      toast.success("Xóa thực đơn thành công")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MENUS.PERSONAL] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || "Xóa thực đơn thất bại")
    },
  })
}
