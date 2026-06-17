import { ExerciseForm } from "@/components/features/exercises/ExerciseForm"
import { createExercise } from "@/api/exercises.api"
import { ExerciseFormDTO } from "@/schemas/exercise.schema"
import { ExerciseRequest } from "@/types/exercises.type"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { ROUTES } from "@/constants/routes"
import { PageLayout } from "@/layouts/PageLayout"

export function ExerciseCreatePage() {
  const navigate = useNavigate()

  const { mutate: createMutate, isPending } = useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      toast.success("Tạo bài tập thành công!")
      navigate(ROUTES.EXERCISES.LIST)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error?.message || "Có lỗi xảy ra khi tạo bài tập")
    },
  })

  const handleSubmit = (data: ExerciseFormDTO) => {
    // Transform form data to API request format
    const request: ExerciseRequest = {
      name: data.name,
      level: data.level,
      description: data.description,
      trainingTypeId: Number(data.trainingTypeId),
      met: Number(data.met),
      equipmentIds: data.equipmentIds.map(Number),
      primaryMuscleGroupIds: data.primaryMuscleGroupIds.map(Number),
      secondaryMuscleGroupIds: data.secondaryMuscleGroupIds.map(Number),
      steps: data.steps.map((s) => s.value).filter((s) => s.trim() !== ""),
      tips: data.tips.map((t) => t.value).filter((t) => t.trim() !== ""),
      mistakes: data.mistakes.map((m) => m.value).filter((m) => m.trim() !== ""),
      benefits: data.benefits.map((b) => b.value).filter((b) => b.trim() !== ""),
      thumbnail: data.thumbnail?.[0],
      video: data.video?.[0],
    }

    createMutate(request)
  }

  return (
    <PageLayout title="Tạo bài tập">
      <ExerciseForm onSubmit={handleSubmit} isLoading={isPending} />
    </PageLayout>
  )
}
