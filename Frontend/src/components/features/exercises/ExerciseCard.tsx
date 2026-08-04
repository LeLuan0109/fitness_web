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

export const ExerciseCard = ({ title, description, muscleGroups, difficulty, imageUrl, id }: ExerciseCardProps) => {
  const navigate = useNavigate()

  const navigateToExerciseDetail = (exerciseId: string) => {
    navigate(generatePath(ROUTES.EXERCISES.DETAIL, { id: exerciseId }))
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "BEGINNER":
        return "bg-clay hover:bg-earth"
      case "INTERMEDIATE":
        return "bg-earth hover:bg-clay"
      case "ADVANCED":
        return "bg-[#B35F4A] hover:bg-[#9C4433]"
      default:
        return "bg-clay hover:bg-earth"
    }
  }

  return (
    <Card
      className="w-full max-w-md overflow-hidden border-sand/60 bg-card py-0 text-card-foreground cursor-pointer transition-all 
      duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-xl hover:shadow-earth/10 
      hover:-translate-y-1 group"
      onClick={() => navigateToExerciseDetail(id)}
    >
      {/* Image Section */}
      <div className="relative h-60 bg-cream overflow-hidden">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cream to-sand-light flex items-center justify-center transition-colors duration-300">
            <span className="text-earth/55 transition-colors duration-300">Ảnh bài tập</span>
          </div>
        )}

        {/* Overlay effect on hover */}
        <div className="absolute inset-0 bg-earth/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <CardContent className="p-4 text-earth transition-all duration-300 ">
        {/* Header with title and difficulty */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-earth transition-colors duration-300 group-hover:text-clay">{title}</h3>
          <Badge
            className={`${getDifficultyColor(
              difficulty,
            )} text-cream px-3 py-1 rounded-full text-sm transition-transform duration-300`}
          >
            {/* {difficulty.charAt(0).toUpperCase() + difficulty?.slice(1).toLowerCase()} */}
            {difficulty ? EXERCISE_LEVEL_LABELS[difficulty] : "Không xác định"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-earth/60 text-sm mb-4 leading-relaxed transition-colors duration-300 group-hover:text-earth/75 truncate">
          {description}
        </p>

        {/* Muscle groups */}
        <div className="space-y-2">
          <p className="text-earth font-medium transition-colors duration-300 ">Nhóm cơ:</p>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-sand/70 bg-cream/60 text-earth/65 hover:bg-earth hover:text-cream hover:border-earth px-3 py-1 rounded-full transition-all duration-300 transform hover:scale-105"
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
