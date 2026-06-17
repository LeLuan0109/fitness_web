import { ActivityLevel, DifficultyLevel, FitnessGoal, MealType } from "@/types/enum"

export const LOGOUT_MESSAGE_CODE = []

export const MAX_LENGTH = {
  100: 100,
  255: 255,
  1000: 1000,
}

export const DATE_TIME_FORMAT = {
  HYPHEN_DATE_FORMAT: "yyyy-MM-dd",
  HYPHEN_MONTH_FORMAT: "yyyy-MM",
  DATE_TIME_MINUTE_FORMAT: "yyyyMMdd hhmm",
  DATE_TIME_SECOND_FORMAT: "yyyy-MM-dd hh:mm:ss",
  DATE_TIME_SECOND_FORMAT_EXPORT: "yyyyMMdd_hhmmss",
  DATE_FORMAT: "yyyyMMdd",
  DATE_TIME_HOUR_MINUTE_FORMAT: "yyyy-MM-dd hh:mm",
  DATE_TIME_SECOND_TOGETHER: "yyyyMMddhhmmss",
  JA_YEAR_MONTH: "yyyy年MM月分",
  JA_MONTH_DAY: "MM月dd日",
  DATE_FORMAT_SLASH: "dd/MM/yyyy",
}

export const PAGINATION_KEY = {
  PAGE: "page",
  PER_PAGE: "limit",
}

export const FITNESS_GOAL_OPTIONS = [
  { value: FitnessGoal.LOSE_WEIGHT, label: "Giảm cân" },
  { value: FitnessGoal.GAIN_WEIGHT, label: "Tăng cân" },
  { value: FitnessGoal.MUSCLE_MASS_GAIN, label: "Tăng cơ" },
  { value: FitnessGoal.SHAPE_BODY, label: "Giữ dáng/Săn chắc" },
  { value: FitnessGoal.OTHERS, label: "Khác" },
]

export const FITNESS_GOAL_LABELS: Record<FitnessGoal, string> = {
  [FitnessGoal.LOSE_WEIGHT]: "Giảm cân",
  [FitnessGoal.GAIN_WEIGHT]: "Tăng cân",
  [FitnessGoal.MUSCLE_MASS_GAIN]: "Tăng cơ",
  [FitnessGoal.SHAPE_BODY]: "Giữ dáng / Săn chắc",
  [FitnessGoal.OTHERS]: "Khác",
}

export const ACTIVITY_LEVEL_OPTIONS = [
  { value: ActivityLevel.SEDENTARY, label: "Ít vận động" },
  { value: ActivityLevel.LIGHTLY_ACTIVE, label: "Vận động nhẹ (1-3 ngày/tuần)" },
  { value: ActivityLevel.MODERATELY_ACTIVE, label: "Vận động vừa (3-5 ngày/tuần)" },
  { value: ActivityLevel.VERY_ACTIVE, label: "Vận động nhiều (6-7 ngày/tuần)" },
  { value: ActivityLevel.EXTRA_ACTIVE, label: "Vận động rất nhiều (2 lần/ngày)" },
]

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Nam" },
  { value: "FEMALE", label: "Nữ" },
]

export const LEVEL_OPTIONS = [
  { value: DifficultyLevel.BEGINNER, label: "Người mới bắt đầu" },
  { value: DifficultyLevel.INTERMEDIATE, label: "Trung cấp" },
  { value: DifficultyLevel.ADVANCED, label: "Nâng cao" },
]

export const MEAL_NAME_LABELS: Record<MealType, string> = {
  [MealType.BREAKFAST]: "Bữa sáng",
  [MealType.LUNCH]: "Bữa trưa",
  [MealType.DINNER]: "Bữa tối",
  [MealType.EXTRA]: "Bữa phụ",
}

export const MAX_FILE_SIZE = 50 * 1024 * 1024

export const EXERCISE_LEVEL_LABELS: Record<DifficultyLevel, string> = {
  [DifficultyLevel.BEGINNER]: "Người mới bắt đầu",
  [DifficultyLevel.INTERMEDIATE]: "Trung cấp",
  [DifficultyLevel.ADVANCED]: "Nâng cao",
}
