import { createWorkoutPlan } from "@/api/workout-plan.api"
import { Response, ResponseError } from "@/types/common.type"
import { WorkoutPlanRequest } from "@/types/workout-plan.type"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

type UseCreatePlanOptions = {
  config?: UseMutationOptions<Response<number>, AxiosError<ResponseError>, WorkoutPlanRequest>
}

export const useCreatePlan = ({ config }: UseCreatePlanOptions) => {
  return useMutation<Response<number>, AxiosError<ResponseError>, WorkoutPlanRequest>({
    mutationFn: (data: WorkoutPlanRequest) => createWorkoutPlan(data),
    ...config,
  })
}
