import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { Response } from "@/types/common.type"
import { MenuListResponse, MenuRequest, MenuResponse, MenuSearhParams } from "@/types/meal.type"

export const createMenu = (data: MenuRequest) => {
  return http.post<Response<MenuResponse>>(API_ENDPOINTS.MENUS.CREATE, { data })
}

export const getMyMenus = (params: MenuSearhParams) => {
  return http.get<Response<MenuListResponse[]>>(API_ENDPOINTS.MENUS.PERSONAL, { params })
}

export const getSampleMenu = (params?: MenuSearhParams) => {
  return http.get<Response<MenuListResponse[]>>(API_ENDPOINTS.MENUS.SAMPLE, { params })
}

export const getMenuDetail = (id: string | number) => {
  return http.get<Response<MenuResponse>>(API_ENDPOINTS.MENUS.DETAIL.replace(":id", String(id)))
}

export const updateMenu = (id: string | number, data: MenuRequest) => {
  return http.put<Response<MenuResponse>>(API_ENDPOINTS.MENUS.UPDATE.replace(":id", String(id)), { data })
}

export const deleteMenu = (id: string | number) => {
  return http.delete<Response<void>>(API_ENDPOINTS.MENUS.DELETE.replace(":id", String(id)))
}

export const copyMenu = (id: string | number) => {
  return http.post<Response<MenuResponse>>(API_ENDPOINTS.MENUS.COPY.replace(":id", String(id)))
}
