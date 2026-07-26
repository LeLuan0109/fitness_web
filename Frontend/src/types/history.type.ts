import { ChartDataResponse } from "./common.type"

export type TimeFilter = "this_week" | "this_month" | "all"

export type ExerciseType = "push_ups" | "pull_ups" | "squats" | "running" | "cycling" | "all"

// Stats data
export interface StatsData {
  totalSessions: number
  totalCalories: number
  totalTime: number
  currentPoints: number
}

// Exercise entry
export interface ExerciseEntry {
  id: string
  date: Date
  name: string
  sets: number
  reps: number
  caloriesBurned: number
  note?: string
}

// Exercise log with grouped entries by date
export interface ExerciseLog {
  date: Date
  exercises: ExerciseEntry[]
}

// Chart data point
export interface ChartDataPoint {
  date: string
  value: number
}

// Filter form data
export interface HistoryFilters {
  timeFilter: TimeFilter
  fromDate: Date | null
  toDate: Date | null
  exerciseId: number
}

export type WorkoutLogStatisticsResponse = {
  totalWorkouts: number
  totalCalories: number
  currentStreak: number
  longestStreak: number
  caloriesChart: ChartDataResponse[]
  intensityChart: ChartDataResponse[]
}

export type ExerciseHistorySummary = {
  exerciseId: number
  exerciseName: string
  thumbnail: string
  totalSets: number
  totalReps: number
  totalDurations: number
  totalCalories: number
}

export type WorkoutHistoryResponse = {
  date: string
  totalExercises: number
  totalCalories: number
  exercises: ExerciseHistorySummary[]
}

export type WorkoutLogHistoryRequest = {
  fromDate?: string
  toDate?: string
  exerciseId?: number
}

// ===== Nhật ký tập luyện: buổi tập đã log (session) =====
export type WorkoutSessionSummary = {
  workoutDayId: number
  date: string // yyyy-MM-dd
  sessionLabel: string
  planName: string | null
  startTime: string // HH:mm
  durationMinutes: number
  setsCompleted: number
  setsTarget: number
  repsCompleted: number
  repsTarget: number
  volumeKg: number
  completionPercent: number
  prExerciseName: string | null
  prWeightGain: number | null
}

export type SetStatus = "MATCH" | "MISMATCH" | "AI_MISMATCH"

export type WorkoutSessionSetDetail = {
  setNumber: number
  weight: number | null
  targetReps: number | null
  actualReps: number | null
  matchesTarget: boolean
  status: SetStatus
  poseQuality: string | null
}

export type WorkoutSessionExerciseDetail = {
  exerciseId: number
  exerciseName: string
  thumbnail: string | null
  muscleGroupLabel: string | null
  setsCompleted: number
  setsTarget: number
  repsPerSetTarget: number | null
  completionPercent: number
  sets: WorkoutSessionSetDetail[]
}

export type WorkoutSessionDetail = WorkoutSessionSummary & {
  exercises: WorkoutSessionExerciseDetail[]
}
