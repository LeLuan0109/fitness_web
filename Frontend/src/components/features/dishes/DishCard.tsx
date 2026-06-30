import React from "react"
import { Card, CardContent } from "@/components/shared/ui/card"
import { Flame, Beef, Wheat, Droplet } from "lucide-react"

type Dish = {
  id: number
  title: string
  image: string
  calories: number
  protein: number | string
  carbs: number | string
  fat: number | string
  cookTime?: string
}

export const DishCard: React.FC<{ dish: Dish; onClick?: () => void }> = ({ dish, onClick }) => {
  return (
    <Card
      className="py-0 rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="relative h-60 w-full">
        <img src={dish.image} alt={dish.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute left-4 bottom-4 text-white">
          <div className="text-lg font-bold leading-tight">{dish.title}</div>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">{dish.cookTime}</div>
      </div>

      <CardContent className="mb-4">
        <div className="grid grid-cols-4 gap-3 text-sm">
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ff8904]" />
              <span className="text-foreground font-semibold">{dish.calories}</span>
            </div>
            <span className="text-muted-foreground text-xs">Calo</span>
          </div>

          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-2">
              <Beef className="w-4 h-4 text-blue-400" />
              <span className="text-foreground font-semibold">{dish.protein}</span>
            </div>
            <span className="text-muted-foreground text-xs">Protein</span>
          </div>

          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-2">
              <Droplet className="w-4 h-4 text-yellow-400" />
              <span className="text-foreground font-semibold">{dish.fat}</span>
            </div>
            <span className="text-muted-foreground text-xs">Fat</span>
          </div>

          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-2">
              <Wheat className="w-4 h-4 text-amber-400" />
              <span className="text-foreground font-semibold">{dish.carbs}</span>
            </div>
            <span className="text-muted-foreground text-xs">Carbs</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
