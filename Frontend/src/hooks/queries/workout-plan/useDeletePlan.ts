import { deleteWorkoutPlan } from "@/api/workout-plan.api"
import { Response, ResponseError } from "@/types/common.type"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

type useDeletePlanProps = {
  config?: UseMutationOptions<Response<boolean>, AxiosError<ResponseError>, string>
}

export const useDeletePlan = ({ config }: useDeletePlanProps) => {
  return useMutation<Response<boolean>, AxiosError<ResponseError>, string>({
    mutationFn: (id) => deleteWorkoutPlan(id),
    ...config,
  })
}
