import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/shared/ui/card"
import { Separator } from "@/components/shared/ui/separator"
import { FITNESS_GOAL_LABELS } from "@/constants/common"
import { MenuListResponse } from "@/types/meal.type"
import { Beef, Droplet, Edit, Flame, Trash2, Wheat } from "lucide-react"

interface MenuCardProps {
  menu: MenuListResponse
  onDetailClick?: () => void
  onDeleteClick?: () => void
  onUpdateClick?: () => void
}

export const MenuCard = ({ menu, onDetailClick, onDeleteClick, onUpdateClick }: MenuCardProps) => {
  const { name, description, fitnessGoal, calories, protein, carbs, fat, isDefault } = menu

  return (
    <Card className="group border border-border rounded-2xl w-full hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 gap-0 py-0 bg-card backdrop-blur-sm justify-between">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <CardTitle className="text-foreground text-2xl font-bold leading-tight mb-2 group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            <Badge className="bg-gradient-to-r from-[#ff8904] to-[#ff6b00] text-white text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg">
              {FITNESS_GOAL_LABELS[fitnessGoal]}
            </Badge>
          </div>
          {!isDefault && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onUpdateClick}
                className="hover:bg-muted hover:text-primary transition-all"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeleteClick}
                className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-sm font-normal leading-relaxed mb-6 line-clamp-2 truncate">{description}</p>
        )}

        <Separator className="mb-6 bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* Nutrition Info Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center group/item">
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-[#ff8904]/20 to-[#ff8904]/5 group-hover/item:scale-110 transition-transform">
              <Flame className="h-6 w-6 text-[#ff8904]" />
            </div>
            <span className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wide">Calories</span>
            <span className="text-foreground text-xl font-bold">{calories}</span>
          </div>
          <div className="flex flex-col items-center text-center group/item">
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 group-hover/item:scale-110 transition-transform">
              <Beef className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wide">Protein</span>
            <span className="text-foreground text-xl font-bold">{protein}g</span>
          </div>
          <div className="flex flex-col items-center text-center group/item">
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 group-hover/item:scale-110 transition-transform">
              <Wheat className="h-6 w-6 text-amber-400" />
            </div>
            <span className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wide">Carbs</span>
            <span className="text-foreground text-xl font-bold">{carbs}g</span>
          </div>
          <div className="flex flex-col items-center text-center group/item">
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 group-hover/item:scale-110 transition-transform">
              <Droplet className="h-6 w-6 text-yellow-400" />
            </div>
            <span className="text-muted-foreground text-xs font-medium mb-1 uppercase tracking-wide">Fat</span>
            <span className="text-foreground text-xl font-bold">{fat}g</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pb-6 pt-0">
        <Button
          variant="ghost"
          className="w-full bg-muted hover:bg-primary hover:text-primary-foreground border border-border hover:border-primary transition-all duration-300 font-semibold"
          onClick={onDetailClick}
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  )
}
