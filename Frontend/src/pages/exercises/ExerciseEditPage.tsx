import { ExerciseForm } from "@/components/features/exercises/ExerciseForm"
import { ROUTES } from "@/constants/routes"
import { useDetailFormExercise } from "@/hooks/queries/exercises/useDetailFormExercise"
import { useUpdateExercise } from "@/hooks/queries/exercises/useUpdateExercise"
import { PageLayout } from "@/layouts/PageLayout"
import { ExerciseFormDTO } from "@/schemas/exercise.schema"
import { ExerciseRequest } from "@/types/exercises.type"
import { Loader2 } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"

export function ExerciseEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  // Fetch exercise detail
  const { data: exerciseData, isLoading: isLoadingDetail } = useDetailFormExercise(id)

  const { mutate: updateMutate, isPending } = useUpdateExercise()

  const handleSubmit = (data: ExerciseFormDTO) => {
    if (!id) return

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

    updateMutate(
      { id, data: request },
      {
        onSuccess: () => {
          toast.success("Cập nhật bài tập thành công!")
          navigate(ROUTES.EXERCISES.LIST)
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.error?.message || "Có lỗi xảy ra khi cập nhật bài tập")
        },
      },
    )
  }

  if (isLoadingDetail) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // Transform API response to form data
  const initialData: ExerciseFormDTO | undefined = exerciseData
    ? {
        name: exerciseData?.name,
        level: exerciseData?.level,
        description: exerciseData?.description,
        trainingTypeId: exerciseData?.trainingTypeId.toString(),
        met: exerciseData?.met ? exerciseData?.met.toString() : "0",
        equipmentIds: exerciseData.equipments?.map((id) => id.toString()) || [],
        primaryMuscleGroupIds: exerciseData.primaryMusclesIds?.map((id) => id.toString()) || [],
        secondaryMuscleGroupIds: exerciseData.secondaryMusclesIds?.map((id) => id.toString()) || [],
        steps: exerciseData.steps?.map((s) => ({ value: s })) || [{ value: "" }],
        tips: exerciseData.tips?.map((t) => ({ value: t })) || [{ value: "" }],
        mistakes: exerciseData.mistakes?.map((m) => ({ value: m })) || [{ value: "" }],
        benefits: exerciseData.benefits?.map((b) => ({ value: b })) || [{ value: "" }],
      }
    : undefined

  return (
    <PageLayout title="Chỉnh sửa bài tập">
      <ExerciseForm
        idEdit={id}
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={isPending}
        existingThumbnail={exerciseData?.thumbnail}
        existingVideo={exerciseData?.videoUrl}
      />
    </PageLayout>
  )
}
