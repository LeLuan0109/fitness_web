import { updateUserStatus } from "@/api/user.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

interface UpdateUserStatusParams {
  userId: number
  isLocked: boolean
}

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation<Response<string>, AxiosError<ResponseError>, UpdateUserStatusParams>({
    mutationFn: ({ userId, isLocked }: UpdateUserStatusParams) => updateUserStatus(userId, isLocked),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS_LIST] })
      const message = variables.isLocked
        ? response.data || "Đã khóa tài khoản thành công!"
        : response.data || "Đã mở khóa tài khoản thành công!"
      toast.success(message)
    },
    onError: (error, variables) => {
      const defaultMessage = variables.isLocked ? "Khóa tài khoản thất bại" : "Mở khóa tài khoản thất bại"
      const errorMessage = error.response?.data?.error?.message || defaultMessage
      toast.error(errorMessage)
    },
  })
}
