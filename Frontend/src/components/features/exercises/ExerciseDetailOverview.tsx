import { Badge } from "@/components/shared/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { EXERCISE_LEVEL_LABELS } from "@/constants/common"
import { ExerciseResponse } from "@/types/exercises.type"
import { getDifficultyColor } from "@/utils/utils"
import { Video } from "lucide-react"

type ExerciseDetailOverviewProps = {
  exercise: ExerciseResponse
}

export const ExerciseDetailOverview = ({ exercise }: ExerciseDetailOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-3xl mb-2">{exercise?.name}</CardTitle>
            <CardDescription className="text-base">{exercise?.trainingType}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(exercise.level)}>
            {exercise?.level ? EXERCISE_LEVEL_LABELS[exercise.level] : "Không xác định"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Exercise Image */}
        <div className="rounded-lg overflow-hidden bg-muted border">
          <video
            className="w-full h-140 object-cover"
            controls
            poster={exercise.thumbnail || undefined}
            preload="metadata"
          >
            <source src={exercise.videoUrl} type="video/mp4" />
            <source src={exercise.videoUrl} type="video/webm" />
            <source src={exercise.videoUrl} type="video/ogg" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
          <div className="p-4 bg-accent/50 flex items-center gap-2 text-sm">
            <Video className="w-4 h-4" />
            <span>Video hướng dẫn chi tiết</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
