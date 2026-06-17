import { getFitnessGoalSelectOptions } from "@/api/common.api"
import { Option, Response, ResponseError } from "@/types/common.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetFitnessGoalOptions = () => {
  return useQuery<Response<Option[]>, AxiosError<ResponseError>, Option[]>({
    queryKey: ["fitness-goal-options"],
    queryFn: getFitnessGoalSelectOptions,
    select: (data) => data.data ?? [],
  })
}
