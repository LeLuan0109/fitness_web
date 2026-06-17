import { Card } from "@/components/shared/ui/card"
import { TypographyH4 } from "@/components/shared/ui/typography"
import type { MealResponse } from "@/types/meal.type"
import { Disc } from "lucide-react"

interface MealBreakdownProps {
  meal: MealResponse
  mealName: string
}

export const MealBreakdown = ({ meal, mealName }: MealBreakdownProps) => {
  return (
    <Card className="bg-meal-card-bg border border-meal-card-border rounded-2xl p-6 shadow-md">
      {/* Header with meal name and macro info */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <TypographyH4 variant="bold">{mealName}</TypographyH4>
        <div className="flex items-center gap-4 text-text-muted text-sm font-normal">
          <span className="text-white">{meal.calories.toFixed(1)} kcal</span>
          <span>P: {meal.protein.toFixed(1)}g</span>
          <span>C: {meal.carbs.toFixed(1)}g</span>
          <span>F: {meal.fat.toFixed(1)}g</span>
        </div>
      </div>

      {/* Dish list - only show calories */}
      <div className="space-y-3">
        {meal.dishes.map((dish) => (
          <div key={dish.dishId} className="flex items-start gap-3">
            <Disc className="w-3 h-3 text-meal-bullet mt-1.5 shrink-0" fill="currentColor" />
            <div className="flex-1 flex items-start justify-between gap-4 flex-wrap">
              <span className="text-white font-normal">
                {dish.name} ({dish.quantity} phần)
              </span>
              <span className="text-text-muted text-md font-normal whitespace-nowrap">
                {dish.totalCalories.toFixed(1)} kcal
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
