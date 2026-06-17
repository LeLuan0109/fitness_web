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
