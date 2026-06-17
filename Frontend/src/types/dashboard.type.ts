import { MenuResponse } from "./meal.type"

export type WorkoutPlanSuggested = {
  id: number
  name: string
  description?: string | null
  isDefault?: boolean | null
  daysPerWeek?: number | null
  durationWeek?: number | null
  startDate?: string | null
  targetGoal?: string
  difficultyLevel?: string | null
  isDeleted?: boolean
}

export type DashboardResponse = {
  bmi: number
  tdee: number
  targetCalories: number
  suggestedMenus: MenuResponse[]
  suggestedWorkoutPlans: WorkoutPlanSuggested[]
}

export type ChartResponse = {
  label: string
  value: number
}

export type DashboardStatsResponse = {
  totalActivateUsers: number
  newUsersToday: number
  totalSystemMenus: number
  totalSystemPlans: number
}
