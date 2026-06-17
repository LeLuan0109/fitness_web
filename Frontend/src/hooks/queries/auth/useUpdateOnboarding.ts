import { updateOnboarding } from "@/api/user.api"
import { ResponseError } from "@/types/common.type"
import { OnboardingDTO, UserResponse } from "@/types/user.type"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useUpdateOnboarding = ({
  config,
}: {
  config?: UseMutationOptions<UserResponse, AxiosError<ResponseError>, OnboardingDTO>
}) => {
  return useMutation<UserResponse, AxiosError<ResponseError>, OnboardingDTO>({
    mutationFn: async (data: OnboardingDTO) => {
      const response = await updateOnboarding(data)
      return response.data
    },
    ...config,
  })
}
