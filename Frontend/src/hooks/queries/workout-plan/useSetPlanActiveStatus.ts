import { setWorkoutPlanActiveStatus } from "@/api/workout-plan.api"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

type Variables = { id: string; isActive: boolean }

type useSetPlanActiveStatusProps = {
  config?: UseMutationOptions<Response<boolean>, AxiosError<ResponseError>, Variables>
}

export const useSetPlanActiveStatus = ({ config }: useSetPlanActiveStatusProps) => {
  return useMutation<Response<boolean>, AxiosError<ResponseError>, Variables>({
    mutationFn: ({ id, isActive }) => setWorkoutPlanActiveStatus(id, isActive),
    ...config,
  })
}
