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
        return "bg-emerald-700 hover:bg-emerald-800"
      case "INTERMEDIATE":
        return "bg-clay hover:bg-earth"
      case "ADVANCED":
        return "bg-earth hover:bg-earth/80"
      default:
        return "bg-sand-dark hover:bg-clay"
    }
  }

  return (
    <Card
      className="group w-full max-w-md cursor-pointer overflow-hidden border-sand/60 bg-card py-0 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl hover:shadow-earth/10"
      onClick={() => navigateToExerciseDetail(id)}
    >
      {/* Image Section */}
      <div className="relative h-60 overflow-hidden bg-sand-light/30">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand-light to-cream transition-colors duration-300">
            <span className="text-clay/50 transition-colors duration-300">Ảnh bài tập</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-earth/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <CardContent className="p-4 transition-all duration-300">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold text-earth transition-colors duration-300 group-hover:text-clay">
            {title}
          </h3>
          <Badge
            className={`${getDifficultyColor(difficulty)} rounded-full px-3 py-1 text-sm text-cream transition-transform duration-300`}
          >
            {difficulty ? EXERCISE_LEVEL_LABELS[difficulty] : "Không xác định"}
          </Badge>
        </div>

        {/* Description */}
        <p className="mb-4 truncate text-sm leading-relaxed text-clay/70 transition-colors duration-300 group-hover:text-earth/80">
          {description}
        </p>

        {/* Muscle groups */}
        <div className="space-y-2">
          <p className="font-medium text-earth transition-colors duration-300">Nhóm cơ:</p>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle, index) => (
              <Badge
                key={index}
                variant="outline"
                className="transform rounded-full border-sand bg-cream/60 px-3 py-1 text-clay transition-all duration-300 hover:scale-105 hover:border-clay/40 hover:bg-sand/40 hover:text-earth"
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
