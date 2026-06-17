import { updateUserProfile } from "@/api/user.api"
import { Response, ResponseError } from "@/types/common.type"
import { UpdateUserProfileRequest } from "@/types/user.type"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

type UseUpdateUserProfileOptions = {
  config?: UseMutationOptions<
    Response<boolean>,
    AxiosError<ResponseError>,
    { data: UpdateUserProfileRequest; avatarFile?: File }
  >
}

export const useUpdateUserProfile = ({ config }: UseUpdateUserProfileOptions) => {
  return useMutation({
    mutationFn: async ({ data, avatarFile }: { data: UpdateUserProfileRequest; avatarFile?: File }) =>
      updateUserProfile(data, avatarFile),
    ...config,
  })
}
