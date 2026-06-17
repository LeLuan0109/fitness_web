import { Badge } from "@/components/shared/ui/badge"
import { EXERCISE_LEVEL_LABELS } from "@/constants/common"
import { getDifficultyColor } from "@/utils/utils"

type RelatedExerciseProps = {
  id: number
  name: string
  difficulty: string
  type: string
}

export const RelatedExercise = (related: RelatedExerciseProps) => {
  return (
    <div key={related.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">{related.name}</h4>
          <p className="text-sm text-muted-foreground">{related.type}</p>
        </div>
        <Badge className={getDifficultyColor(related.difficulty)} variant="outline">
          {related?.difficulty ? EXERCISE_LEVEL_LABELS[related.difficulty] : "Không xác định"}
        </Badge>
      </div>
    </div>
  )
}
