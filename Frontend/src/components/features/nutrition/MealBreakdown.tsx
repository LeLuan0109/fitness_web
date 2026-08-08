import { Card } from "@/components/shared/ui/card"
import { TypographyH4 } from "@/components/shared/ui/typography"
import type { MealResponse } from "@/types/meal.type"
import { Disc } from "lucide-react"
import { cn } from "@/lib/utils"

interface MealBreakdownProps {
  meal: MealResponse
  mealName: string
  appearance?: "user" | "admin"
}

export const MealBreakdown = ({ meal, mealName, appearance = "user" }: MealBreakdownProps) => {
  const isAdmin = appearance === "admin"

  return (
    <Card className={cn("rounded-2xl border p-5 sm:p-6", isAdmin ? "bg-card text-foreground shadow-sm" : "border-sand/60 bg-white text-earth shadow-sm shadow-earth/5")}>
      {/* Header with meal name and macro info */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <TypographyH4 variant="bold">{mealName}</TypographyH4>
        <div className={cn("flex flex-wrap items-center gap-4 text-sm font-medium", isAdmin ? "text-muted-foreground" : "text-earth/60")}>
          <span className={cn(isAdmin ? "text-foreground" : "text-earth")}>{meal.calories.toFixed(1)} kcal</span>
          <span>P: {meal.protein.toFixed(1)}g</span>
          <span>C: {meal.carbs.toFixed(1)}g</span>
          <span>F: {meal.fat.toFixed(1)}g</span>
        </div>
      </div>

      {/* Dish list - only show calories */}
      <div className="space-y-3">
        {meal.dishes.map((dish) => (
          <div key={dish.dishId} className="flex items-start gap-3">
            <Disc className={cn("mt-1.5 size-3 shrink-0", isAdmin ? "text-primary" : "text-clay")} fill="currentColor" />
            <div className="flex-1 flex items-start justify-between gap-4 flex-wrap">
              <span className={cn("font-medium", !isAdmin && "text-earth")}>
                {dish.name} ({dish.quantity} phần)
              </span>
              <span className={cn("text-md whitespace-nowrap font-normal", isAdmin ? "text-muted-foreground" : "text-earth/60")}>
                {dish.totalCalories.toFixed(1)} kcal
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
