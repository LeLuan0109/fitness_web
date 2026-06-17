import { getTrainingTypeOptions } from "@/api/training-type.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Option, Response, ResponseError } from "@/types/common.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetTrainingTypeOptions = () => {
  return useQuery<Response<Option[]>, AxiosError<ResponseError>, Option[]>({
    queryKey: [QUERY_KEYS.TRAINING_TYPE_OPTIONS],
    queryFn: getTrainingTypeOptions,
    select: (data) => data.data ?? [],
  })
}
