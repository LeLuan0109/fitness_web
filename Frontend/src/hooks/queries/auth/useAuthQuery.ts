import { useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query"

import {
  forgotPasswordApi,
  getBasicInfo,
  loginApi,
  loginWithFacebook,
  loginWithGoogle,
  logoutApi,
  registerApi,
} from "@/api/auth.api"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import type { QueryConfig } from "@/lib/react-query"
import { LoginDTO, RegisterDTO } from "@/schemas/auth.schema"
import { BasicInfo, LoginResponse, LogoutRequest, RegisterResponse } from "@/types/auth.type"
import type { Response, ResponseError } from "@/types/common.type"
import { AxiosError } from "axios"

type UserProfileOptions = { config: QueryConfig<typeof getBasicInfo> }

export const useGetBasicInfo = ({ config }: UserProfileOptions) => {
  return useQuery<Response<BasicInfo>, Error>({
    queryKey: [QUERY_KEYS.BASIC_INFO],
    queryFn: getBasicInfo,
    ...config,
  })
}

type UseLoginOptions = {
  config?: UseMutationOptions<Response<LoginResponse>, AxiosError<ResponseError>, LoginDTO>
}

export const useLogin = ({ config }: UseLoginOptions = {}) => {
  return useMutation<Response<LoginResponse>, AxiosError<ResponseError>, LoginDTO>({
    ...config,
    mutationFn: (data) => loginApi(data),
  })
}

type UseLogoutOptions = {
  config?: UseMutationOptions<Response<string>, AxiosError<ResponseError>, LogoutRequest>
}

export const useLogout = ({ config }: UseLogoutOptions = {}) => {
  return useMutation({
    mutationFn: (data: LogoutRequest) => logoutApi(data),
    ...config,
  })
}

type UseLoginWithGoogleOptions = {
  config: UseMutationOptions<Response<LoginResponse>, AxiosError<ResponseError>, { tokenId: string }>
}

export const useLoginWithGoogle = ({ config }: UseLoginWithGoogleOptions) => {
  return useMutation({
    mutationFn: ({ tokenId }: { tokenId: string }) => loginWithGoogle(tokenId),
    ...config,
  })
}

type UseLoginWithFacebookOptions = {
  config: UseMutationOptions<Response<LoginResponse>, AxiosError<ResponseError>, { accessToken: string }>
}

export const useLoginWithFacebook = ({ config }: UseLoginWithFacebookOptions) => {
  return useMutation({
    mutationFn: ({ accessToken }: { accessToken: string }) => loginWithFacebook(accessToken),
    ...config,
  })
}

type UseRegisterOptions = {
  config?: UseMutationOptions<Response<RegisterResponse>, AxiosError<ResponseError>, RegisterDTO>
}

export const useRegister = ({ config }: UseRegisterOptions = {}) => {
  return useMutation<Response<RegisterResponse>, AxiosError<ResponseError>, RegisterDTO>({
    mutationFn: (data) => registerApi(data),
    ...config,
  })
}

type UseForgotPasswordOptions = {
  config?: UseMutationOptions<Response<null>, AxiosError<ResponseError>, string>
}

export const useForgotPassword = ({ config }: UseForgotPasswordOptions = {}) => {
  return useMutation<Response<string>, AxiosError<ResponseError>, string>({
    mutationFn: (email) => forgotPasswordApi(email),
    ...config,
  })
}
