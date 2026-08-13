import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { AxiosError } from "axios"

import { updateIngredient } from "@/api/ingredient.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { ResponseError } from "@/types/common.type"
import type { IngredientRequest } from "@/types/ingredient.type"

export const useUpdateIngredient = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredientRequest }) => updateIngredient(id, data),
    onSuccess: (_, variables) => {
      toast.success("Cập nhật nguyên liệu thành công!")
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INGREDIENTS.LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INGREDIENTS.DETAIL, variables.id.toString()] })
      navigate(-1)
    },
    onError: (error: AxiosError<ResponseError>) => {
      toast.error(error?.response?.data?.error?.message || "Có lỗi xảy ra khi cập nhật nguyên liệu")
    },
  })
}
