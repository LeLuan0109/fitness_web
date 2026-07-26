import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import {
  DailyCheckinRequest,
  LogWeightRequest,
  ProgressCalendar,
  ProgressDayDetail,
  ProgressOverview,
} from "@/types/progress.type"

// Tổng quan tiến độ 3 trụ so với kỳ vọng
export const getProgressOverview = () => {
  return http.get<Response<ProgressOverview>>(API_ENDPOINTS.PROGRESS.OVERVIEW)
}

// Lịch tiến độ theo tháng (vd: "2025-07")
export const getProgressCalendar = (month: string) => {
  return http.get<Response<ProgressCalendar>>(API_ENDPOINTS.PROGRESS.CALENDAR, { params: { month } })
}

// Chi tiết 1 ngày trong lịch tiến độ (vd: "2025-07-21"). workoutDayId: bắt buộc khi ngày đó có nhiều buổi (nhiều kế hoạch song song)
export const getProgressDayDetail = (date: string, workoutDayId?: number) => {
  return http.get<Response<ProgressDayDetail>>(API_ENDPOINTS.PROGRESS.DAY_DETAIL, {
    params: { date, workoutDayId },
  })
}

// Ghi cân nặng hôm nay
export const logWeight = (data: LogWeightRequest) => {
  return http.post<Response<boolean>>(API_ENDPOINTS.PROGRESS.WEIGHT, { data })
}

// Ghi nước uống + trả lời có ăn đúng thực đơn không
export const dailyCheckin = (data: DailyCheckinRequest) => {
  return http.post<Response<boolean>>(API_ENDPOINTS.PROGRESS.CHECKIN, { data })
}
