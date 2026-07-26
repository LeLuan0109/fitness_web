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

export type ScoredPlanSuggestion = {
  plan: WorkoutPlanSuggested
  matchScore: number
  reasons: string[]
}

export type ScoredMenuSuggestion = {
  menu: MenuResponse
  matchScore: number
  reasons: string[]
}

export type DashboardResponse = {
  bmi: number
  tdee: number
  targetCalories: number
  difficulty?: string
  usedFallback?: boolean
  weightGap?: number | null
  estimatedWeeksToGoal?: number | null
  paceWarning?: string | null
  suggestedMenus: MenuResponse[]
  suggestedWorkoutPlans: WorkoutPlanSuggested[]
  workoutPlanSuggestions?: ScoredPlanSuggestion[]
  menuSuggestions?: ScoredMenuSuggestion[]
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
