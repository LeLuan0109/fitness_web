import { getSelectEquipmentOptions } from "@/api/equipment.api"
import { Option, Response, ResponseError } from "@/types/common.type"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"

export const useGetEquipmentOptions = () => {
  return useQuery<Response<Option[]>, AxiosError<ResponseError>, Option[]>({
    queryKey: ["equipment-options"],
    queryFn: getSelectEquipmentOptions,
    select: (data) => data.data ?? [],
  })
}
