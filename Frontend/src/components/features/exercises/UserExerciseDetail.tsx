import { Card, CardContent, CardHeader } from "@/components/shared/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs"
import { Button } from "@/components/shared/ui/button"
import { useDetailExercises } from "@/hooks/queries/exercises/useDetailExercises"
import { useGetRelatedExercise } from "@/hooks/queries/exercises/useGetRelatedExercise"
import { mapMuscleGroupsCompact } from "@/utils/muscle-group.util"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useNavigate, useParams } from "react-router"
import { ExerciseDetailOverview } from "./ExerciseDetailOverview"
import { ExerciseInstruction } from "./ExerciseInstruction"
import { ExerciseNote } from "./ExerciseNote"
import { RelatedExerciseGroup } from "./RelatedExerciseGroup"

export function UserExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: exercise, isFetching: isFetchingDetail } = useDetailExercises(id)
  const { data: relatedExercises, isFetching: isFetchingRelated } = useGetRelatedExercise(id)

  if (isFetchingDetail || isFetchingRelated) {
    return (
      <div className="flex items-center justify-center py-12 text-clay">
        <Loader2 className="size-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 text-earth">
      <Button
        variant="ghost"
        className="text-earth hover:bg-sand/40 hover:text-clay"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 size-4" />
        Quay lại
      </Button>

      <div className="grid gap-6">
        <ExerciseDetailOverview exercise={exercise} />
        <Card className="border-sand/60 bg-white shadow-sm shadow-earth/5">
          <Tabs defaultValue="instructions" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2 bg-cream text-earth">
                <TabsTrigger value="instructions">Hướng dẫn bài tập</TabsTrigger>
                <TabsTrigger value="tips">Lưu ý</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
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
      </div>
    </div>
  )
}
