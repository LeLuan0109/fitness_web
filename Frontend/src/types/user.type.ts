import { Role } from "./role.type"

export type UserProfileResponse = {
  id: number
  name: string | null
  email: string
  username: string
  avatar: string | null
  dateOfBirth: string | null
  weight: number | null
  height: number | null
  memberSince: string
  totalWorkouts: number
  totalHours: number
  totalCalories: number
  monthlyStats: MonthlyStatsData
  activityLevel: string
  fitnessGoal: string
}

export type MonthlyStatsData = {
  monthName: string
  totalWorkouts: number
  activeDays: number
  currentStreak: number
  totalDurationMin: number
  avgDurationMin: number
  totalCalories: number
}

export type BasicInfoData = {
  avatar: string | null
  username: string
  memberSince: string
  totalWorkouts: number
  totalHours: number
  totalCalories: number
}

export type PersonalInfoData = {
  avatar: string | null
  name: string | null
  email: string
  dateOfBirth: Date | null
  weight: number | null
  height: number | null
  activityLevel?: string
  fitnessGoal?: string
  gender: string
}

export type UserProfileData = {
  basicInfo: BasicInfoData
  personalInfo: PersonalInfoData
  monthlyStats: MonthlyStatsData
}

export type UpdateUserProfileRequest = {
  name?: string | null
  dateOfBirth?: string
  weight?: number
  height?: number
  avatar: string | null
  activityLevel: string
  fitnessGoal: string
}

export type UserResponse = {
  id: number
  name: string | null
  email: string
  username: string
  sex: string
  dateOfBirth: string
  avatar: string | null
  height: number
  weight: number
  isLocked: boolean
  currentStreak: number | null
  longestStreak: number | null
  role: Role
}

export type OnboardingDTO = {
  sex: string
  dateOfBirth: string
  weight: number
  height: number
  fitnessGoal: string
  activityLevel: string
  experienceLevel?: string
  daysPerWeekAvailable?: number
  targetWeight?: number
}

export type UserSearchParams = {
  keyword?: string
  page?: number
  limit?: number
}
