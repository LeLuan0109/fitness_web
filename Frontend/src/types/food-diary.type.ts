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
