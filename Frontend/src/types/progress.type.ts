export interface LoggedExercise {
  id: number
  name: string
}

export interface ProgressPoint {
  date: string
  maxWeight: number
  maxReps: number
  estimatedOneRm: number
  volume: number
}

export interface ExerciseProgress {
  exerciseId: number
  exerciseName: string
  points: ProgressPoint[]
  bestWeight: number
  bestReps: number
  bestEstimatedOneRm: number
  bestDate: string | null
}

// ===== Tiến độ so với kỳ vọng (3 trụ) =====
export type ProgressStatus = "ON_TRACK" | "CAUTION" | "OFF_TRACK" | "NO_DATA"

export interface ProgressEnergy {
  status: ProgressStatus
  avgIntake: number
  targetCalories: number
  tdee: number
  deficitSurplus: number
  trend: "UP" | "DOWN" | "STABLE"
  loggedDays: number
  waterMlToday: number
  waterTarget: number
}

export interface ProgressWeight {
  hasData: boolean
  status: ProgressStatus
  current: number | null
  start: number | null
  target: number | null
  progressPercent: number | null
  weeklyRate: number | null
}

export interface ProgressWorkout {
  hasPlan: boolean
  status: ProgressStatus
  planName: string | null
  sessionsThisWeek: number
  targetPerWeek: number
  adherencePercent: number | null
}

export interface ProgressOverview {
  overallStatus: ProgressStatus
  message: string
  energy: ProgressEnergy
  weight: ProgressWeight
  workout: ProgressWorkout
}

export interface LogWeightRequest {
  weight: number
  date?: string // dd/MM/yyyy
}

export interface DailyCheckinRequest {
  waterMl?: number
  followedMenu?: boolean
  date?: string // dd/MM/yyyy
}
