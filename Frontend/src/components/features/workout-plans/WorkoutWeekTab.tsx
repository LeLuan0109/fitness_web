import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Button } from "@/components/shared/ui/button"
import { Plus } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { ScheduleItem, ExerciseSelected } from "@/schemas/workout-plan.schema"
import { WorkoutDayCard } from "@/components/features/workout-plans/WorkoutDayCard"
import { Option } from "@/types/common.type"
import { WorkoutFormData } from "@/types/workout-plan.type"

type WorkoutWeekTabProps = {
  weekIndex: number
  weekItems: Array<ScheduleItem & { originalIndex: number }>
  exerciseOptions: Option[]
}

export const WorkoutWeekTab = ({ weekItems, exerciseOptions }: WorkoutWeekTabProps) => {
  const { setValue, getValues } = useFormContext<WorkoutFormData>()

  const addExercise = (scheduleIndex: number) => {
    const currentSchedule = getValues("schedule")
    const newExercise: ExerciseSelected = {
      exerciseId: "",
      sets: "3",
      reps: "10",
      duration: "60",
      weight: "0",
    }

    currentSchedule[scheduleIndex].exercises.push(newExercise)
    setValue("schedule", [...currentSchedule], { shouldValidate: true, shouldDirty: true })
  }

  const getDayName = (dayOfWeek: number) => {
    const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
    return days[dayOfWeek] || `Ngày ${dayOfWeek}`
  }

  return (
    <div className="space-y-4">
      {weekItems.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Không có dữ liệu cho tuần này</p>
        </div>
      ) : (
        weekItems.map((item) => (
          <Card key={item.originalIndex}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{getDayName(item.dayOfWeek)}</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => addExercise(item.originalIndex)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm bài tập
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <WorkoutDayCard scheduleIndex={item.originalIndex} dayItem={item} exerciseOptions={exerciseOptions} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
