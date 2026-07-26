export interface FoodLogItem {
  id: number
  dishId: number | null
  dishName: string
  image: string | null
  quantity: number
  mealType: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface FoodDiary {
  date: string
  items: FoodLogItem[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
}

export interface AddFoodLogRequest {
  dishId?: number | null
  customName?: string
  quantity?: number
  actualCalories?: number // số calo thực tế người dùng nhập (ưu tiên)
  actualProtein?: number
  actualCarbs?: number
  actualFat?: number
  date?: string // dd/MM/yyyy
  mealType?: string
}

export interface DayMacro {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface FoodDiarySummary {
  fromDate: string
  toDate: string
  days: DayMacro[]
  avgCalories: number
  avgProtein: number
  avgCarbs: number
  avgFat: number
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
}

// ===== Lịch nhật ký ăn (carousel % hoàn thành theo ngày) =====
export interface FoodDiaryDayCell {
  date: string // yyyy-MM-dd
  completionPercent: number
  mealsLogged: number
  mealsPlanned: number
}

export interface FoodDiaryCalendar {
  days: FoodDiaryDayCell[]
}

export type MealSlotStatus = "MATCH" | "CHANGED" | "SKIPPED" | "PLANNED"

export interface FoodDiaryMealSlot {
  mealType: string
  mealTypeLabel: string
  time: string
  plannedDishName: string | null
  actualItemName: string | null
  actualCalories: number | null
  actualProtein: number | null
  actualCarbs: number | null
  actualFat: number | null
  status: MealSlotStatus
}

export interface FoodDiaryDayDetail {
  date: string
  completionPercent: number
  mealsLogged: number
  mealsPlanned: number
  totalCalories: number
  targetCalories: number
  totalProtein: number
  targetProtein: number
  totalCarbs: number
  targetCarbs: number
  totalFat: number
  targetFat: number
  waterMl: number | null
  waterTarget: number
  weekAdherencePercent: number | null
  slots: FoodDiaryMealSlot[]
}
