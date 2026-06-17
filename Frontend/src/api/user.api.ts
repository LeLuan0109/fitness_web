import { API_ENDPOINTS } from "@/constants/api"
import { http } from "@/lib/http"
import { ChangePasswordDTO } from "@/schemas/change-password.schema"
import { Response } from "@/types/common.type"
import {
  OnboardingDTO,
  UpdateUserProfileRequest,
  UserProfileResponse,
  UserResponse,
  UserSearchParams,
} from "@/types/user.type"

export const updateOnboarding = async (data: OnboardingDTO): Promise<Response<UserResponse>> => {
  return http.put<Response<UserResponse>>(API_ENDPOINTS.USER.ONBOARDING, { data })
}

export const changePassword = (data: ChangePasswordDTO) => {
  return http.post<Response<string>>(API_ENDPOINTS.USER.CHANGE_PASSWORD, { data })
}

export const getUserProfile = () => {
  return http.get<Response<UserProfileResponse>>(API_ENDPOINTS.USER.PROFILE)
}

export const updateUserProfile = (data: UpdateUserProfileRequest, avatarFile?: File) => {
  const formData = new FormData()

  // Append các field dữ liệu
  Object.keys(data).forEach((key) => {
    const value = data[key as keyof UserProfileResponse]
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString())
    }
  })

  // Append file avatar nếu có
  if (avatarFile) {
    formData.append("avatarFile", avatarFile)
  }

  return http.put<Response<boolean>>(API_ENDPOINTS.USER.PROFILE, {
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

export const getAllUsers = (params: UserSearchParams) => {
  return http.get<Response<UserResponse[]>>(API_ENDPOINTS.USER.ALL, { params })
}

export const updateUserStatus = (userId: number, isLocked: boolean) => {
  return http.put<Response<string>>(
    API_ENDPOINTS.USER.BAN.replace(":id", userId.toString()),
    {
      params: { isLocked },
    }
  )
}
