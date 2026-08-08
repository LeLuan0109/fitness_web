import React from "react"
import { Card, CardContent } from "@/components/shared/ui/card"
import { ImageWithFallback } from "@/components/shared/common/image-with-fallbacks"
import { Clock, Flame } from "lucide-react"

// Define Dish type
type Dish = {
  id: number;
  title: string;
  image: string;
  calories: number | string;
  protein: number | string;
  carbs: number | string;
  fat: number | string;
  cookTime?: string;
}

export const AdminDishCard: React.FC<{ dish: Dish; onClick?: () => void }> = ({ dish, onClick }) => {
  const stats = [
    { label: "Calo", value: `${dish.calories} kcal` },
    { label: "Protein", value: `${dish.protein}g` },
    { label: "Chất béo", value: `${dish.fat}g` },
    { label: "Carbs", value: `${dish.carbs}g` },
  ]

  return (
    <Card
      className="group cursor-pointer gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 sm:h-52">
        <ImageWithFallback
          src={dish.image}
          alt={dish.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {dish.cookTime && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur">
            <Clock className="size-3.5 text-blue-600" /> {dish.cookTime}
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="mb-4 flex items-start gap-2">
          <Flame className="mt-0.5 size-4 shrink-0 text-blue-600" />
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
            {dish.title}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-100 pt-4">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <span className="block text-xs font-medium text-slate-400">{stat.label}</span>
              <span className="mt-0.5 block truncate text-sm font-semibold text-slate-700">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
