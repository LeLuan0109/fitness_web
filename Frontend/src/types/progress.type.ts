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

// ===== Lịch tiến độ theo tháng (calendar dashboard) =====
export type DayCellStatus = "COMPLETED" | "PARTIAL" | "MISSED" | "PLANNED" | "REST" | "NONE"

export interface ProgressCalendarSummary {
  currentWeight: number | null
  weightChangeTotal: number | null
  weeklyRate: number | null
  avgCalories: number
  targetCalories: number
  workoutSessionsDone: number
  workoutSessionsTotal: number
  workoutAdherencePercent: number
  mealDaysLogged: number
  mealDaysTotal: number
  mealAdherencePercent: number
  progressScore: number
  progressScoreLabel: string
}

export interface ProgressDaySession {
  planId: number
  planName: string
  workoutDayId: number
  sessionLabel: string
  status: Exclude<DayCellStatus, "REST" | "NONE">
}

export interface ProgressDayCell {
  date: string // yyyy-MM-dd
  sessions: ProgressDaySession[] // rỗng = Nghỉ (không kế hoạch nào có buổi tập ngày đó)
  caloriesEaten: number | null
  caloriesTarget: number
  weight: number | null
}

export interface ProgressCalendar {
  summary: ProgressCalendarSummary
  days: ProgressDayCell[]
}

export interface ProgressDayDetailExercise {
  exerciseId: number
  exerciseName: string
  setsPlanned: number
  setsLogged: number
  done: boolean
}

export interface ProgressDayDetailMeal {
  name: string
  calories: number
  mealType: string
}

export interface ProgressDayDetail {
  date: string
  status: DayCellStatus
  planDayLabel: string | null
  exercises: ProgressDayDetailExercise[]
  meals: ProgressDayDetailMeal[]
  caloriesEaten: number
  caloriesTarget: number
  weight: number | null
}
