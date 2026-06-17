import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AxiosError } from "axios"

import { createIngredient } from "@/api/ingredient.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { ROUTES } from "@/constants/routes"
import { ResponseError } from "@/types/common.type"

export const useCreateIngredient = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createIngredient,
    onSuccess: () => {
      toast.success("Tạo nguyên liệu mới thành công!")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INGREDIENTS.LIST] })
      navigate(ROUTES.INGREDIENTS.LIST)
    },
    onError: (error: AxiosError<ResponseError>) => {
      toast.error(error?.response?.data?.error?.message || "Có lỗi xảy ra khi tạo nguyên liệu")
    },
  })
}
