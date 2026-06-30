import { Badge } from "@/components/shared/ui/badge"
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
        return "bg-green-500 hover:bg-green-600"
      case "INTERMEDIATE":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "ADVANCED":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-green-500 hover:bg-green-600"
    }
  }

  return (
    <Card
      className="w-full max-w-md border-border overflow-hidden py-0 cursor-pointer transition-all 
      duration-300 ease-in-out transform hover:scale-102 hover:shadow-2xl hover:shadow-primary/20 
      hover:-translate-y-1 group"
      onClick={() => navigateToExerciseDetail(id)}
    >
      {/* Image Section */}
      <div className="relative h-60 bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center transition-colors duration-300 group-hover:bg-muted/80">
            <span className="text-muted-foreground transition-colors duration-300">Ảnh bài tập</span>
          </div>
        )}

        {/* Overlay effect on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <CardContent className="p-4 transition-all duration-300 ">
        {/* Header with title and difficulty */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-foreground transition-colors duration-300 ">{title}</h3>
          <Badge
            className={`${getDifficultyColor(
              difficulty,
            )} text-white px-3 py-1 rounded-full text-sm transition-transform duration-300`}
          >
            {/* {difficulty.charAt(0).toUpperCase() + difficulty?.slice(1).toLowerCase()} */}
            {difficulty ? EXERCISE_LEVEL_LABELS[difficulty] : "Không xác định"}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed transition-colors duration-300 truncate">
          {description}
        </p>

        {/* Muscle groups */}
        <div className="space-y-2">
          <p className="text-foreground font-medium transition-colors duration-300 ">Nhóm cơ:</p>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-transparent border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary px-3 py-1 rounded-full transition-all duration-300 transform hover:scale-105"
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
