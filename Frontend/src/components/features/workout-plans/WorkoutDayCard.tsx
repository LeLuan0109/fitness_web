import { Button } from "@/components/shared/ui/button"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Input } from "@/components/shared/ui/input"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { ScheduleItem } from "@/schemas/workout-plan.schema"
import { Option } from "@/types/common.type"
import { WorkoutFormData } from "@/types/workout-plan.type"
import { Trash2 } from "lucide-react"
import { useFormContext } from "react-hook-form"

type WorkoutDayCardProps = {
  scheduleIndex: number
  dayItem: ScheduleItem
  exerciseOptions: Option[]
}

export const WorkoutDayCard = ({ scheduleIndex, dayItem, exerciseOptions }: WorkoutDayCardProps) => {
  const { control, setValue, getValues } = useFormContext<WorkoutFormData>()

  const removeExercise = (exerciseIndex: number) => {
    const currentSchedule = getValues("schedule")
    const currentDayExercises = currentSchedule[scheduleIndex].exercises

    if (currentDayExercises.length <= 1) {
      return // Keep at least one exercise
    }

    currentDayExercises.splice(exerciseIndex, 1)
    setValue("schedule", [...currentSchedule], { shouldValidate: true, shouldDirty: true })
  }

  return (
    <div className="space-y-3">
      {dayItem.exercises.map((_, exerciseIndex) => {
        const isOnlyExercise = dayItem.exercises.length === 1
        const exerciseBaseName = `schedule.${scheduleIndex}.exercises.${exerciseIndex}`

        return (
          <div key={exerciseIndex} className="grid grid-cols-12 gap-2 items-start">
            <div className="col-span-3">
              <SimpleField
                name={`${exerciseBaseName}.exerciseId` as keyof WorkoutFormData}
                control={control}
                label="Bài tập"
              >
                {(field) => (
                  <CustomSelect
                    options={exerciseOptions}
                    placeholder="Chọn bài tập"
                    value={field.value ? String(field.value) : ""}
                    onChange={(value) => (value ? field.onChange(value) : field.onChange(""))}
                    searchable
                  />
                )}
              </SimpleField>
            </div>

            <div className="col-span-2">
              <SimpleField name={`${exerciseBaseName}.sets` as keyof WorkoutFormData} control={control} label="Sets">
                {(field) => (
                  <Input
                    {...field}
                    type="number"
                    value={String(field.value ?? "")}
                    onChange={(e) => (e.target.value ? field.onChange(e.target.value) : field.onChange(""))}
                  />
                )}
              </SimpleField>
            </div>

            <div className="col-span-2">
              <SimpleField name={`${exerciseBaseName}.reps` as keyof WorkoutFormData} control={control} label="Reps">
                {(field) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="10"
                    value={String(field.value ?? "")}
                    onChange={(e) => (e.target.value ? field.onChange(e.target.value) : field.onChange(""))}
                  />
                )}
              </SimpleField>
            </div>

            <div className="col-span-2">
              <SimpleField
                name={`${exerciseBaseName}.duration` as keyof WorkoutFormData}
                control={control}
                label="Thời gian (s)"
              >
                {(field) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="60"
                    value={String(field.value ?? "")}
                    onChange={(e) => (e.target.value ? field.onChange(e.target.value) : field.onChange(""))}
                  />
                )}
              </SimpleField>
            </div>
            <div className="col-span-2">
              <SimpleField
                name={`${exerciseBaseName}.weight` as keyof WorkoutFormData}
                control={control}
                label="Tạ (kg)"
              >
                {(field) => (
                  <Input
                    {...field}
                    type="number"
                    value={field.value ? String(field.value) : ""}
                    onChange={field.onChange}
                  />
                )}
              </SimpleField>
            </div>

            <div className="col-span-1 flex items-start mt-[28px]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExercise(exerciseIndex)}
                className={`${isOnlyExercise ? "text-muted-foreground cursor-not-allowed" : "text-destructive"}`}
                disabled={isOnlyExercise}
                title={isOnlyExercise ? "Mỗi ngày cần có ít nhất 1 bài tập" : "Xóa bài tập"}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
