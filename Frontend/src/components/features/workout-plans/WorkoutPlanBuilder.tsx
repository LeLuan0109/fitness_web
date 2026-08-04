import { WorkoutWeekTab } from "@/components/features/workout-plans/WorkoutWeekTab"
import { Button } from "@/components/shared/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shared/ui/tabs"
import { ScheduleItem } from "@/schemas/workout-plan.schema"
import { Option } from "@/types/common.type"
import { WorkoutFormData } from "@/types/workout-plan.type"
import { Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

type WorkoutPlanBuilderProps = {
  exerciseOptions: Option[]
}

export const WorkoutPlanBuilder = ({ exerciseOptions }: WorkoutPlanBuilderProps) => {
  const { watch, setValue } = useFormContext<WorkoutFormData>()
  const [activeWeek, setActiveWeek] = useState(1)

  const watchedDuration = watch("durationWeek")
  const watchedSchedule = watch("schedule") || []
  const numWeeks = Number(watchedDuration) || 0

  // Reset activeWeek về 1 nếu activeWeek hiện tại lớn hơn số tuần
  useEffect(() => {
    if (activeWeek > numWeeks && numWeeks > 0) {
      setActiveWeek(1)
    }
  }, [numWeeks, activeWeek])

  // Sử dụng watchedSchedule thay vì fields để đảm bảo có dữ liệu mới nhất
  const groupedByWeek = watchedSchedule.reduce((acc, item, index) => {
    const weekNumber = item.weekNumber
    if (!acc[weekNumber]) acc[weekNumber] = []
    acc[weekNumber].push({ ...item, originalIndex: index })
    return acc
  }, {} as Record<number, Array<ScheduleItem & { originalIndex: number }>>)

  const copyFromPreviousWeek = (weekIndex: number) => {
    if (weekIndex === 1) return

    // Deep clone toàn bộ schedule để React Hook Form detect thay đổi
    const currentSchedule = watchedSchedule.map((item) => ({
      ...item,
      exercises: item.exercises.map((ex) => ({ ...ex })),
    }))

    // Lọc items của tuần trước
    const previousWeekItems = currentSchedule.filter((item) => item.weekNumber === weekIndex - 1)

    // Cập nhật từng item của tuần hiện tại
    currentSchedule.forEach((item, index) => {
      if (item.weekNumber === weekIndex) {
        const correspondingPrevItem = previousWeekItems.find((prevItem) => prevItem.dayOfWeek === item.dayOfWeek)
        if (correspondingPrevItem) {
          currentSchedule[index] = {
            ...item,
            exercises: correspondingPrevItem.exercises.map((ex) => ({ ...ex })),
          }
        }
      }
    })

    // Set lại toàn bộ schedule để trigger re-render
    setValue("schedule", currentSchedule, { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div>
      <h3 className="mb-4">Lập kế hoạch bài tập</h3>

      <Tabs value={activeWeek.toString()} onValueChange={(value) => setActiveWeek(parseInt(value))}>
        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${numWeeks}, 1fr)` }}>
          {Array.from({ length: Number(numWeeks) }, (_, i) => {
            const weekNumber = i + 1
            return (
              <TabsTrigger key={weekNumber} value={weekNumber.toString()}>
                Tuần {weekNumber}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {Array.from({ length: Number(numWeeks) }, (_, i) => {
          const weekNumber = i + 1
          return (
            <TabsContent key={weekNumber} value={weekNumber.toString()} className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Tuần {weekNumber}</h4>
                {weekNumber > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={() => copyFromPreviousWeek(weekNumber)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Sao chép từ tuần trước
                  </Button>
                )}
              </div>
              <WorkoutWeekTab
                weekIndex={weekNumber}
                weekItems={groupedByWeek[weekNumber] ?? []}
                exerciseOptions={exerciseOptions}
              />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
