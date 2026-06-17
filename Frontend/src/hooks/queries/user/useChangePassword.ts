import { changePassword } from "@/api/user.api"
import { ChangePasswordDTO } from "@/schemas/change-password.schema"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

type UseChangePasswordOptions = {
  config?: UseMutationOptions<Response<string>, AxiosError<ResponseError>, ChangePasswordDTO>
}

export const useChangePassword = ({ config }: UseChangePasswordOptions = {}) => {
  return useMutation<Response<string>, AxiosError<ResponseError>, ChangePasswordDTO>({
    mutationFn: (data) => changePassword(data),
    ...config,
  })
}
