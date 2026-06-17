import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import { Notification, RegisterTokenRequest } from "@/types/notification.type"
import { generatePath } from "react-router"

export const registerDeviceToken = (data: RegisterTokenRequest) => {
  return http.post<Response<boolean>>(API_ENDPOINTS.NOTIFICATIONS.REGISTER_TOKEN, { data })
}

export const getMyNotifications = (page = 0, limit = 10) => {
  return http.get<Response<Notification[]>>(API_ENDPOINTS.NOTIFICATIONS.LIST, {
    params: { page, limit },
  })
}

export const markAsRead = (id: number) => {
  return http.put<Response<boolean>>(generatePath(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, { id: id.toString() }))
}

export const getNumberOfUnreadNotifications = () => {
  return http.get<Response<number>>(API_ENDPOINTS.NOTIFICATIONS.COUNT_UNREAD)
}
