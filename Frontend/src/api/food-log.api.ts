import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import {
  AddFoodLogRequest,
  FoodDiary,
  FoodDiaryCalendar,
  FoodDiaryDayDetail,
  FoodDiarySummary,
} from "@/types/food-diary.type"

// date theo định dạng dd/MM/yyyy (khớp @DateTimeFormat ở backend)
export const getFoodDiary = (date?: string) => {
  return http.get<Response<FoodDiary>>(API_ENDPOINTS.FOOD_LOGS.LIST, {
    params: date ? { date } : undefined,
  })
}

export const addFoodLog = (data: AddFoodLogRequest) => {
  return http.post<Response<FoodDiary>>(API_ENDPOINTS.FOOD_LOGS.ADD, { data })
}

export const deleteFoodLog = (id: number) => {
  return http.delete<Response<boolean>>(API_ENDPOINTS.FOOD_LOGS.DELETE.replace(":id", String(id)))
}

// from/to theo định dạng dd/MM/yyyy
export const getFoodDiarySummary = (from: string, to: string) => {
  return http.get<Response<FoodDiarySummary>>(API_ENDPOINTS.FOOD_LOGS.SUMMARY, {
    params: { from, to },
  })
}

// from/to theo định dạng yyyy-MM-dd — lịch % hoàn thành thực đơn theo ngày (carousel)
export const getFoodDiaryCalendar = (from: string, to: string) => {
  return http.get<Response<FoodDiaryCalendar>>(API_ENDPOINTS.FOOD_LOGS.DIARY_CALENDAR, {
    params: { from, to },
  })
}

// date theo định dạng yyyy-MM-dd — chi tiết timeline từng bữa của 1 ngày
export const getFoodDiaryDayDetail = (date: string) => {
  return http.get<Response<FoodDiaryDayDetail>>(API_ENDPOINTS.FOOD_LOGS.DAY_DETAIL, {
    params: { date },
  })
}
