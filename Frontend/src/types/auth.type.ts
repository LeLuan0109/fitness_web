import { AuthProvider } from "@/types/enum"
import { Role } from "./role.type"

export type BasicInfo = {
  id: string
  email: string
  username: string
  name: string
  avatar: string
  role: Role
  onboardingCompleted: boolean
}

export type LoginResponse = {
  refreshToken: string
  accessToken: string
}

export type LogoutRequest = {
  token: string
}

export type RegisterResponse = {
  id: string
  name: string
  email: string
  username: string
  avatar: string
  height: number
  weight: number
  provider: AuthProvider
  isLocked: boolean
  currentStreak: number
  longestStreak: number
}
