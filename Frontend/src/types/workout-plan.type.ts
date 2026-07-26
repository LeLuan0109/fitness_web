import { Pagination } from "./common.type"

export type WorkoutPlanSearchParams = {
  keyword?: string
  goal?: string
  level?: string
  duration?: string
  page?: number
  limit?: number
}

export type PlanListResponse = {
  id: number
  name: string
  description: string
  goal: string
  durationWeek: number
  daysPerWeek: number
  targetGoal: string
  difficultyLevel: string
  isDefault: boolean
  isActive: boolean | null
}

export type PlanListData = {
  data: PlanListResponse[]
  pagination: Pagination
}

export type WorkoutLogResponse = {
  id: number
  exerciseName: string
  thumbnail: string
  setNumber: number
  reps: number
  weight: number
  duration: number
  caloriesBurned: number
}

export type PlanExerciseDetailResponse = {
  exerciseId: number
  exerciseName: string
  thumbnail: string
  sets: number
  reps: number
  weight: number
  duration: number
  logs: WorkoutLogResponse[]
}

export type PlanDayResponse = {
  id: number
  dayOfWeek: number
  dayInNumber: number
  exercises: PlanExerciseDetailResponse[]
}

export type PlanWeekResponse = {
  weekNumber: number
  days: PlanDayResponse[]
}

export type PlanDetailResponse = {
  id: number
  name: string
  description: string
  durationWeek: number
  daysPerWeek: number
  totalUsers: number
  targetGoal: string
  difficultyLevel: string
  isDefault: boolean
  createdAt: string
  startDate: string
  weeks: PlanWeekResponse[]
}

export type PlanExerciseRequest = {
  exerciseId: number
  sets?: number
  reps?: number
  weight?: number
  duration?: number
}

export type PlanDayRequest = {
  weekNumber: number
  dayOfWeek: number
  exercises: PlanExerciseRequest[]
}

export type WorkoutPlanRequest = {
  name: string
  goal: string
  startDate?: string
  durationWeek: number
  daysPerWeek: number
  level: string
  description: string
  schedule: PlanDayRequest[]
}

export type WorkoutFormData = {
  name?: string
  description?: string
  goal?: string
  startDate?: Date
  durationWeek?: string
  daysPerWeek?: string
  level?: string
  schedule?: {
    exercises?: {
      sets?: string
      reps?: string
      weight?: string
      duration?: string
      exerciseId?: string
      logs?: WorkoutLogResponse[]
    }[]
    weekNumber?: number
    dayOfWeek?: number
    id?: number
  }[]
}
