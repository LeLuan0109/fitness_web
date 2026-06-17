import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import type { LoginDTO, RegisterDTO } from "@/schemas/auth.schema"
import type { BasicInfo, LoginResponse, LogoutRequest, RegisterResponse } from "@/types/auth.type"
import type { Response } from "@/types/common.type"

export const getBasicInfo = async (): Promise<Response<BasicInfo>> => {
  return http.get<Response<BasicInfo>>(API_ENDPOINTS.AUTH.BASIC_INFO)
}

export const loginApi = (data: LoginDTO) => {
  return http.post<Response<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, { data })
}

export const logoutApi = (data: LogoutRequest) => {
  return http.post(API_ENDPOINTS.AUTH.LOGOUT, { data })
}

export const loginWithGoogle = (tokenId: string) => {
  return http.post<Response<LoginResponse>>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
    data: { tokenId },
  })
}

export const loginWithFacebook = (accessToken: string) => {
  return http.post<Response<LoginResponse>>(API_ENDPOINTS.AUTH.FACEBOOK_LOGIN, {
    data: { accessToken },
  })
}

export const registerApi = (data: RegisterDTO) => {
  return http.post<Response<RegisterResponse>>(API_ENDPOINTS.AUTH.REGISTER, { data })
}

export const forgotPasswordApi = (email: string) => {
  return http.post<Response<string>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { data: { email } })
}
