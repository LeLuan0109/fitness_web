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
        return "border-emerald-200 bg-emerald-50 text-emerald-700"
      case "INTERMEDIATE":
        return "border-amber-200 bg-amber-50 text-amber-700"
      case "ADVANCED":
        return "border-red-200 bg-red-50 text-red-700"
      default:
        return "border-slate-200 bg-slate-50 text-slate-600"
    }
  }

  return (
    <Card
      className="group w-full cursor-pointer gap-0 overflow-hidden rounded-2xl border-slate-200 bg-white py-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
      onClick={() => navigateToExerciseDetail(id)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-slate-100 sm:h-52">
        {imageUrl ? (
          <ImageWithFallback
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <span className="text-sm text-slate-400">Chưa có ảnh bài tập</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </div>

      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 transition-colors group-hover:text-blue-700">
            {title}
          </h3>
          <Badge
            className={`${getDifficultyColor(difficulty)} shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium shadow-none`}
          >
            {difficulty ? EXERCISE_LEVEL_LABELS[difficulty] : "Không xác định"}
          </Badge>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-500">
          {description}
        </p>

        {/* Muscle groups */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Nhóm cơ</p>
          <div className="flex flex-wrap gap-2">
            {muscleGroups.map((muscle, index) => (
              <Badge
                key={index}
                variant="outline"
                className="rounded-full border-blue-100 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
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
