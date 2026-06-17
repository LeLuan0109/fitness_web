import { FitnessGoal, MealType } from "./enum"

export interface FoodItem {
  id: string
  name: string
  portion: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface Meal {
  id: string
  name: string
  items: FoodItem[]
}

export interface MealPlan {
  id: string
  title: string
  description: string
  status?: "in-use" | "inactive"
  tags?: string[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  meals: Meal[]
  type: "sample" | "personal"
}

export interface MacroSummary {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Menu API Types
export interface MealDishRequest {
  dishId: number
  quantity: number
}

export interface MealRequest {
  name: MealType
  mealType: MealType
  dishes: MealDishRequest[]
}

export interface MenuRequest {
  name: string
  description?: string
  fitnessGoal: FitnessGoal
  meals: MealRequest[]
}

export interface MealDishResponse {
  dishId: number
  name: string
  image: string
  quantity: number
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
}

export interface DishInMeal {
  id: number
  dishId: number
  dishName: string
  dishImage: string
  quantity: number
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface MealResponse {
  id: number
  name: string
  mealType: MealType
  calories: number
  protein: number
  carbs: number
  fat: number
  dishes: MealDishResponse[]
}

export interface MenuResponse {
  id: number
  displayOrder: number
  name: string
  description?: string
  fitnessGoal: FitnessGoal
  caloriesTarget?: number
  isDefault: boolean
  creatorId?: number
  creatorName?: string
  creatorAvatar?: string
  createdAt: string
  updatedAt: string
  calories: number
  protein: number
  carbs: number
  fat: number
  meals: MealResponse[]
}

// Menu Card Display Type
export interface MenuCardData {
  id: number
  name: string
  description?: string
  fitnessGoal: FitnessGoal
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  isSample?: boolean
}

// Menu List Response from API
export interface MenuListResponse {
  id: number
  displayOrder: number
  name: string
  description?: string
  fitnessGoal: FitnessGoal
  isDefault: boolean
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type MenuSearhParams = {
  search?: string
  goal?: string
  minCalories?: number
  maxCalories?: number
  minProtein?: number
  maxProtein?: number
  minCarbs?: number
  maxCarbs?: number
  minFat?: number
  maxFat?: number
  page?: number
  size?: number
}
