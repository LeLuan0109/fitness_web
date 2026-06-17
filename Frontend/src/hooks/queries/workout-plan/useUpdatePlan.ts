import { updateWorkoutPlan } from "@/api/workout-plan.api"
import { Response, ResponseError } from "@/types/common.type"
import { WorkoutPlanRequest } from "@/types/workout-plan.type"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

type UseUpdatePlanOptions = {
  id: string
  config?: UseMutationOptions<Response<number>, AxiosError<ResponseError>, WorkoutPlanRequest>
}

export const useUpdatePlan = ({ id, config }: UseUpdatePlanOptions) => {
  return useMutation<Response<number>, AxiosError<ResponseError>, WorkoutPlanRequest>({
    mutationFn: (data) => updateWorkoutPlan(id, data),
    ...config,
  })
}
