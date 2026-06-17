import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Option, Response } from "@/types/common.type"

export const getSelectEquipmentOptions = () => {
  return http.get<Response<Option[]>>(API_ENDPOINTS.EQUIPMENT.SELECT_OPTIONS)
}
