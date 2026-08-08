import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/shared/ui/card"
import { Separator } from "@/components/shared/ui/separator"
import { FITNESS_GOAL_LABELS } from "@/constants/common"
import { MenuListResponse } from "@/types/meal.type"
import { Beef, Droplet, Edit, Flame, Trash2, Wheat } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuCardProps {
  menu: MenuListResponse
  onDetailClick?: () => void
  onDeleteClick?: () => void
  onUpdateClick?: () => void
  appearance?: "user" | "admin"
}

export const MenuCard = ({ menu, onDetailClick, onDeleteClick, onUpdateClick, appearance = "user" }: MenuCardProps) => {
  const { name, description, fitnessGoal, calories, protein, carbs, fat, isDefault } = menu
  const nutrition = [
    { label: "Calories", value: calories, Icon: Flame },
    { label: "Protein", value: `${protein}g`, Icon: Beef },
    { label: "Carbs", value: `${carbs}g`, Icon: Wheat },
    { label: "Fat", value: `${fat}g`, Icon: Droplet },
  ]

  return (
    <Card
      className={cn(
        "group w-full justify-between gap-0 rounded-2xl bg-card py-0 text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        appearance === "admin"
          ? "border-primary/15 hover:border-primary/45 hover:shadow-primary/10"
          : "border-sand/60 shadow-earth/5 hover:border-clay/40 hover:shadow-earth/10",
      )}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle
              className={cn(
                "mb-2 font-display text-2xl font-semibold leading-tight transition-colors",
                appearance === "admin" ? "text-foreground group-hover:text-primary" : "text-earth group-hover:text-clay",
              )}
            >
              {name}
            </CardTitle>
            <Badge
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm",
                appearance === "admin"
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-sand/60 bg-cream text-clay",
              )}
            >
              {FITNESS_GOAL_LABELS[fitnessGoal]}
            </Badge>
          </div>

          {!isDefault && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onUpdateClick}
                className="text-earth/60 transition-all hover:bg-sand-light/60 hover:text-clay"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeleteClick}
                className="text-earth/60 transition-all hover:bg-red-500/10 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {description && (
          <p className={cn("mb-6 line-clamp-2 truncate text-sm font-normal leading-relaxed", appearance === "admin" ? "text-muted-foreground" : "text-earth/65")}>
            {description}
          </p>
        )}

        <Separator className={cn("mb-6", appearance === "admin" ? "bg-primary/15" : "bg-sand/60")} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {nutrition.map(({ label, value, Icon }) => (
            <div key={label} className={cn("rounded-xl border p-3 text-center", appearance === "admin" ? "border-primary/10 bg-primary/[0.04]" : "border-sand/40 bg-cream/45")}>
              <div className={cn("mx-auto mb-2 flex size-10 items-center justify-center rounded-full transition-transform group-hover:scale-105", appearance === "admin" ? "bg-primary/10 text-primary" : "bg-earth/5 text-clay")}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={cn("mb-1 block text-xs font-medium uppercase", appearance === "admin" ? "text-muted-foreground" : "text-earth/50")}>{label}</span>
              <span className={cn("block text-lg font-bold", appearance === "admin" ? "text-foreground" : "text-earth")}>{value}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pb-6 pt-0">
        <Button
          variant="ghost"
          className={cn(
            "w-full rounded-full border font-semibold transition-all duration-300",
            appearance === "admin"
              ? "border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground"
              : "border-sand/60 bg-cream/70 text-earth hover:border-clay hover:bg-earth hover:text-cream",
          )}
          onClick={onDetailClick}
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  )
}
