import { Badge } from "@/components/shared/ui/badge"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { cn } from "@/lib/utils"
import { PlanListResponse } from "@/types/workout-plan.type"
import { getDifficultyColor, getGoalColor, getLevelName } from "@/utils/utils"
import { getFitnessGoalName } from "@/utils/workout-plan.util"
import { Calendar, Copy, Edit, Loader2, Power, Star, Target, Trash2 } from "lucide-react"

interface WorkoutCardProps {
  plan: PlanListResponse
  showFeaturedIcon?: boolean
  variant?: "sample" | "personal"
  onEdit?: (plan: PlanListResponse) => void
  onDelete?: (planId: number) => void
  onViewDetail?: (plan: PlanListResponse) => void
  onClone?: (plan: PlanListResponse) => void
  onToggleActive?: (plan: PlanListResponse) => void
  isCloning?: boolean
  isTogglingActive?: boolean
}

export const WorkoutCard = ({
  plan,
  showFeaturedIcon = false,
  variant = "sample",
  onEdit,
  onDelete,
  onViewDetail,
  onClone,
  onToggleActive,
  isCloning = false,
  isTogglingActive = false,
}: WorkoutCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(plan)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(plan.id)
  }

  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClone?.(plan)
  }

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleActive?.(plan)
  }

  const handleViewDetail = () => {
    onViewDetail?.(plan)
  }

  const isActive = plan.isActive ?? true

  return (
    <Card
      className={cn(
        "border border-border bg-card text-card-foreground hover:shadow-[0_20px_40px_rgba(16,185,129,0.14)] transition-all cursor-pointer hover:border-primary/50 justify-between",
        variant === "personal" && !isActive && "opacity-60",
      )}
      onClick={handleViewDetail}
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">{plan.name}</CardTitle>

          {/* Sample workout: Show featured icon */}
          {variant === "personal" && showFeaturedIcon && (
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 flex-shrink-0" />
          )}

          {/* Personal workout: Show action buttons */}
          {variant === "personal" && (
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className={cn("h-8 w-8", isActive ? "text-success" : "text-muted-foreground")}
                onClick={handleToggleActive}
                disabled={isTogglingActive}
                title={isActive ? "Đang hoạt động — bấm để bỏ kế hoạch" : "Đã bỏ — bấm để kích hoạt lại"}
              >
                {isTogglingActive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Sample workout: Show clone-to-personal button */}
          {variant === "sample" && onClone && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 flex-shrink-0"
              onClick={handleClone}
              disabled={isCloning}
              title="Sao chép về kế hoạch cá nhân"
            >
              {isCloning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>
        <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 ">
        <div className="flex flex-wrap gap-2">
          {variant === "personal" && (
            <Badge
              className={isActive ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}
              variant="outline"
            >
              {isActive ? "Đang hoạt động" : "Đã bỏ"}
            </Badge>
          )}
          <Badge className={getDifficultyColor(plan.difficultyLevel)} variant="outline">
            {getLevelName(plan.difficultyLevel)}
          </Badge>
          <Badge className={getGoalColor(plan.targetGoal)} variant="outline">
            {getFitnessGoalName(plan.targetGoal)}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{plan.durationWeek} tuần</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="w-4 h-4" />
            <span>{plan.daysPerWeek}x/tuần</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
