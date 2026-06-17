import { copyWorkoutPlan } from "@/api/workout-plan.api"
import { Response, ResponseError } from "@/types/common.type"
import { MutationOptions, useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

type Props = {
  config?: MutationOptions<Response<string>, AxiosError<ResponseError>, string>
}

export const useCopyPlan = ({ config }: Props) => {
  return useMutation({
    mutationFn: (id) => copyWorkoutPlan(id),
    ...config,
  })
}
