import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import { DailyCheckinRequest, LogWeightRequest, ProgressOverview } from "@/types/progress.type"

// Tổng quan tiến độ 3 trụ so với kỳ vọng
export const getProgressOverview = () => {
  return http.get<Response<ProgressOverview>>(API_ENDPOINTS.PROGRESS.OVERVIEW)
}

// Ghi cân nặng hôm nay
export const logWeight = (data: LogWeightRequest) => {
  return http.post<Response<boolean>>(API_ENDPOINTS.PROGRESS.WEIGHT, { data })
}

// Ghi nước uống + trả lời có ăn đúng thực đơn không
export const dailyCheckin = (data: DailyCheckinRequest) => {
  return http.post<Response<boolean>>(API_ENDPOINTS.PROGRESS.CHECKIN, { data })
}
