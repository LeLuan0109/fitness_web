import { Response } from "@/types/common.type"
import { UserProfileData, UserProfileResponse } from "@/types/user.type"

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
      dateOfBirth: userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth) : new Date(),
      weight: userProfile.weight ?? 0,
      height: userProfile.height ?? 0,
      activityLevel: userProfile?.activityLevel ?? "",
      fitnessGoal: userProfile?.fitnessGoal ?? "",
      gender: "MALE",
    },
    monthlyStats: userProfile.monthlyStats,
  }
}
