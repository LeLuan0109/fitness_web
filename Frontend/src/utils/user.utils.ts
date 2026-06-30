import { Response } from "@/types/common.type"
import { UserProfileData, UserProfileResponse } from "@/types/user.type"
import { parse, isValid } from "date-fns"

const parseDateOfBirth = (dateStr: string | null): Date | null => {
  if (!dateStr) return null
  // Backend returns dd/MM/yyyy format via @JsonFormat
  const parsed = parse(dateStr, "dd/MM/yyyy", new Date())
  if (isValid(parsed)) return parsed
  // Fallback: try native Date parsing (ISO format etc.)
  const fallback = new Date(dateStr)
  return isNaN(fallback.getTime()) ? null : fallback
}

export const transformUserProfile = (data: Response<UserProfileResponse>): UserProfileData => {
  const { data: userProfile } = data

  return {
    basicInfo: {
      avatar: userProfile?.avatar ?? "",
      username: userProfile.username,
      memberSince: userProfile.memberSince,
      totalWorkouts: userProfile.totalWorkouts,
      totalHours: userProfile.totalHours,
      totalCalories: userProfile.totalCalories,
    },
    personalInfo: {
      avatar: userProfile?.avatar ?? null,
      name: userProfile?.name ?? "",
      email: userProfile.email,
      dateOfBirth: parseDateOfBirth(userProfile.dateOfBirth),
      weight: userProfile.weight ?? 0,
      height: userProfile.height ?? 0,
      activityLevel: userProfile?.activityLevel ?? "",
      fitnessGoal: userProfile?.fitnessGoal ?? "",
      gender: "MALE",
    },
    monthlyStats: userProfile.monthlyStats,
  }
}
