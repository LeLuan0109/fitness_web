import { Badge } from "@/components/shared/ui/badge"
import { ImageWithFallback } from "@/components/shared/common/image-with-fallbacks"
import { Card, CardContent } from "@/components/shared/ui/card"
import { EXERCISE_LEVEL_LABELS } from "@/constants/common"
import { ROUTES } from "@/constants/routes"
import { generatePath, useNavigate } from "react-router"

interface ExerciseCardProps {
  id: string
  title: string
  description?: string
  muscleGroups: string[]
  difficulty?: string
  imageUrl?: string
}

export const AdminExerciseCard = ({ title, description, muscleGroups, difficulty, imageUrl, id }: ExerciseCardProps) => {
  const navigate = useNavigate()

  const navigateToExerciseDetail = (exerciseId: string) => {
    navigate(generatePath(ROUTES.EXERCISES.DETAIL, { id: exerciseId }))
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-emerald-600 hover:bg-emerald-700"
      case "INTERMEDIATE":
        return "bg-amber-500 hover:bg-amber-600"
      case "ADVANCED":
        return "bg-destructive hover:bg-destructive/90"
      default:
        return "bg-muted text-muted-foreground hover:bg-muted/80"
    }
  }

  return (
    <Card
      className="group w-full max-w-md cursor-pointer overflow-hidden border-border bg-card/80 py-0 backdrop-blur-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:border-primary/40 hover:shadow-xl"
      onClick={() => navigateToExerciseDetail(id)}
    >
      {/* Image Section */}
      <div className="relative h-60 overflow-hidden bg-muted/30">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted/60 to-muted transition-colors duration-300">
            <span className="text-muted-foreground/60 transition-colors duration-300">Ảnh bài tập</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <CardContent className="p-4 transition-all duration-300">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="font-display text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
            {title}
          </h3>
          <Badge
            className={`${getDifficultyColor(difficulty)} shrink-0 rounded-full px-3 py-1 text-sm text-white transition-transform duration-300`}
          >
            {difficulty ? EXERCISE_LEVEL_LABELS[difficulty] : "Không xác định"}
          </Badge>
        </div>

        {/* Description */}
        <p className="mb-4 truncate text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
          {description}
        </p>

        {/* Muscle groups */}
        <div className="space-y-2">
          <p className="font-medium text-foreground transition-colors duration-300">Nhóm cơ:</p>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle, index) => (
              <Badge
                key={index}
                variant="outline"
                className="transform rounded-full border-border bg-muted/50 px-3 py-1 text-muted-foreground transition-all duration-300 hover:scale-105 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                {muscle}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
