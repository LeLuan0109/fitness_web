import { DATE_TIME_FORMAT } from "@/constants/common"
import { format } from "date-fns"

export const removeEmptyValues = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => {
      if (value === null || value === undefined || value === "") return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    }),
  ) as Partial<T>
}

export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getGoalColor = (goal: string) => {
  switch (goal.toLowerCase()) {
    case "lose_weight":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "muscle_gain":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    case "gain_weight":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    case "shape_body":
      return "bg-green-500/20 text-green-400 border-green-500/30"
    default:
      return "bg-gray-500/20 text-gray-400"
  }
}

export const formatDateddMMyyyy = (date: Date): string => {
  return format(date, DATE_TIME_FORMAT.DATE_FORMAT_SLASH)
}

export const getLevelName = (level: string): string => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "Dễ"
      break
    case "intermediate":
      return "Trung bình"
    case "advanced":
      return "Khó"
    default:
      return "Không xác định"
  }
}
