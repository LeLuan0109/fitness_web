import { ExerciseHistorySummary } from "@/types/history.type"
import { Dumbbell, Flame } from "lucide-react"

interface ExerciseCardProps {
  exercise: ExerciseHistorySummary
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-xl p-5 flex flex-col gap-4 transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
      {/* Exercise Name and Stats */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h4 className="text-foreground text-base font-semibold">{exercise.exerciseName}</h4>
        </div>

        {/* Calories Badge */}
        <div className="flex items-center gap-2 bg-history-calories/10 text-history-calories rounded-full px-3 py-1.5">
          <Flame className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold">{exercise?.totalCalories.toFixed(2)} kcal</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Sets</span>
          <span className="text-foreground text-lg font-bold">{exercise.totalSets}</span>
        </div>

        {exercise.totalReps != null && exercise.totalReps > 0 && (
          <>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Reps</span>
              <span className="text-foreground text-lg font-bold">{exercise.totalReps}</span>
            </div>
          </>
        )}

        {exercise.totalDurations != null && exercise.totalDurations > 0 && (
          <>
            <div className="w-px h-8 bg-border" />
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Tổng thời gian tập
              </span>
              <span className="text-foreground text-lg font-bold">{exercise.totalDurations}s</span>
            </div>
          </>
        )}
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-300 pointer-events-none" />
    </div>
  )
}
