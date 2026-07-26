import { Response } from "@/types/common.type"
import { UserProfileData, UserProfileResponse } from "@/types/user.type"
import { isValid, parse } from "date-fns"

// Backend trả dateOfBirth dạng chuỗi "dd/MM/yyyy" — `new Date(...)` gốc parse sai (Invalid Date),
// khiến SimpleDatePicker crash khi format(). Phải parse đúng theo pattern dd/MM/yyyy.
function parseDateddMMyyyy(value: string | null | undefined): Date {
  if (value) {
    const parsed = parse(value, "dd/MM/yyyy", new Date())
    if (isValid(parsed)) return parsed
  }
  return new Date()
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
      dateOfBirth: parseDateddMMyyyy(userProfile.dateOfBirth),
      weight: userProfile.weight ?? 0,
      height: userProfile.height ?? 0,
      activityLevel: userProfile?.activityLevel ?? "",
      fitnessGoal: userProfile?.fitnessGoal ?? "",
      gender: "MALE",
    },
    monthlyStats: userProfile.monthlyStats,
  }
}
