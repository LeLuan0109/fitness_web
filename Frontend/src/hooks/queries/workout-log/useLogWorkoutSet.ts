import { logWorkoutSet } from "@/api/workout-log.api"
import { Response, ResponseError } from "@/types/common.type"
import { LogSetRequest } from "@/types/workout-log.type"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useLogSet = ({
  config,
}: {
  config?: UseMutationOptions<Response<boolean>, AxiosError<ResponseError>, LogSetRequest>
}) => {
  return useMutation({
    mutationFn: (data: LogSetRequest) => logWorkoutSet(data),
    ...config,
  })
}
