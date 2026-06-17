import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Option, Response } from "@/types/common.type"

export const getTrainingTypeOptions = () => {
  return http.get<Response<Option[]>>(API_ENDPOINTS.TRAINING_TYPE.SELECT_OPTIONS)
}
