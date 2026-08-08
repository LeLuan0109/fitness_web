import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardHeader } from "@/components/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { useDeleteExercise } from "@/hooks/queries/exercises/useDeleteExercise"
import { useDetailExercises } from "@/hooks/queries/exercises/useDetailExercises"
import { useGetRelatedExercise } from "@/hooks/queries/exercises/useGetRelatedExercise"
import { mapMuscleGroupsCompact } from "@/utils/muscle-group.util"
import { ArrowLeft, Edit, Loader2, Trash } from "lucide-react"
import { generatePath, useNavigate, useParams } from "react-router"
import { ExerciseDetailOverview } from "./ExerciseDetailOverview"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { ExerciseNote } from "./ExerciseNote"
import { RelatedExerciseGroup } from "./RelatedExerciseGroup"

export function AdminExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const deleteMutation = useDeleteExercise()
  const { data: exercise, isFetching: isFetchingDetail } = useDetailExercises(id)
  const { data: relatedExercises, isFetching: isFetchingRelated } = useGetRelatedExercise(id)

  if (isFetchingDetail || isFetchingRelated) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleDelete = () => {
    if (!id) return
    deleteMutation.mutate(id, {
      onSuccess: () => navigate(ROUTES.EXERCISES.LIST),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" className="self-start text-slate-600 hover:bg-slate-100" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 size-4" />
          Quay lại
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button
            className="gap-2 bg-blue-600 text-white shadow-sm hover:bg-blue-700"
            onClick={() => navigate(generatePath(ROUTES.EXERCISES.EDIT, { id }))}
          >
            <Edit className="size-4" />
            Chỉnh sửa bài tập
          </Button>
          <Button variant="destructive" className="gap-2" onClick={onOpen}>
            <Trash className="size-4" />
            Xóa
          </Button>
        </div>
      </div>

      <ExerciseDetailOverview exercise={exercise} />
      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
        <Tabs defaultValue="instructions" className="w-full">
          <CardHeader className="border-b border-slate-100 pb-4">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 sm:w-[420px]">
              <TabsTrigger value="instructions" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Hướng dẫn bài tập</TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Lưu ý</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <TabsContent value="instructions">
              <ExerciseInstruction
                step={exercise.steps}
                equipment={exercise.equipments}
                muscleGroups={mapMuscleGroupsCompact(exercise.primaryMuscles, exercise.secondaryMuscles)}
              />
            </TabsContent>
            <TabsContent value="tips" className="space-y-4">
              <ExerciseNote
                tips={exercise.tips}
                commonMistakes={exercise.mistakes}
                healthBenefits={exercise.benefits}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      <RelatedExerciseGroup exercises={relatedExercises} />

      <ConfirmDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        title="Xác nhận xóa bài tập"
        content={`Bạn có chắc chắn muốn xóa bài tập "${exercise.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Xóa bài tập"
        cancelText="Hủy"
      />
    </div>
  )
}
