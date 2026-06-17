import { deleteDish } from "@/api/dish.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useDeleteDish = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<void>, AxiosError<ResponseError>, string>({
    mutationFn: (id: string) => deleteDish(id),
    onSuccess: () => {
      toast.success("Xóa món ăn thành công")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DISHES.LIST] })
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error?.message || "Xóa món ăn thất bại"
      toast.error(errorMessage)
    },
  })
}
