import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardHeader } from "@/components/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs"
import { useDetailExercises } from "@/hooks/queries/exercises/useDetailExercises"
import { ArrowLeft, Edit, Loader2, Trash } from "lucide-react"
import { generatePath, useNavigate, useParams } from "react-router"
import { ExerciseDetailOverview } from "./ExerciseDetailOverview"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { ExerciseNote } from "./ExerciseNote"
import { RelatedExerciseGroup } from "./RelatedExerciseGroup"
import { mapMuscleGroupsCompact } from "@/utils/muscle-group.util"
import { useGetRelatedExercise } from "@/hooks/queries/exercises/useGetRelatedExercise"
import authStore from "@/stores/auth.store"
import { ROLES } from "@/constants/roles.constant"
import { ROUTES } from "@/constants/routes"
import { useDisclosure } from "@/hooks/common/use-disclosure"
import { ConfirmDialog } from "@/components/shared/ui/confirm-dialog"
import { useDeleteExercise } from "@/hooks/queries/exercises/useDeleteExercise"

export const ExerciseDetail = () => {
  const { id } = useParams()
  const isAdminView = authStore.use.auth().role?.name === ROLES.ADMIN
  const navigate = useNavigate()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const deleteMutation = useDeleteExercise()

  const { data: dataDetailExercise, isFetching: isFetchingDetail } = useDetailExercises(id)
  const { data: dataRelatedExercises, isFetching: isFetchingRelated } = useGetRelatedExercise(id)

  if (isFetchingDetail || isFetchingRelated) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const navigateToEdit = () => {
    navigate(generatePath(ROUTES.EXERCISES.EDIT, { id: id }))
  }

  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          navigate(ROUTES.EXERCISES.LIST)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <Button variant="ghost" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        {isAdminView && (
          <div className="flex gap-4">
            <Button onClick={navigateToEdit}>
              <Edit /> Chỉnh sửa bài tập
            </Button>
            <Button variant="destructive" onClick={onOpen}>
              <Trash /> Xóa
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Exercise Overview */}
          <ExerciseDetailOverview exercise={dataDetailExercise} />

          {/* Detailed Information Tabs */}
          <Card>
            <Tabs defaultValue="instructions" className="w-full">
              <CardHeader>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="instructions">Hướng dẫn bài tập</TabsTrigger>
                  <TabsTrigger value="tips">Lưu ý</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="instructions">
                  <ExerciseInstruction
                    step={dataDetailExercise.steps}
                    equipment={dataDetailExercise.equipments}
                    muscleGroups={mapMuscleGroupsCompact(
                      dataDetailExercise.primaryMuscles,
                      dataDetailExercise.secondaryMuscles,
                    )}
                  />
                </TabsContent>

                <TabsContent value="tips" className="space-y-4">
                  <ExerciseNote
                    tips={dataDetailExercise.tips}
                    commonMistakes={dataDetailExercise.mistakes}
                    healthBenefits={dataDetailExercise.benefits}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>

          {/* Related Exercises */}
          <RelatedExerciseGroup exercises={dataRelatedExercises} />
        </div>
      </div>
      <ConfirmDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        title="Xác nhận xóa bài tập"
        content={`Bạn có chắc chắn muốn xóa bài tập "${dataDetailExercise.name}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        variant="destructive"
        confirmText="Xóa bài tập"
        cancelText="Hủy"
      />
    </div>
  )
}
