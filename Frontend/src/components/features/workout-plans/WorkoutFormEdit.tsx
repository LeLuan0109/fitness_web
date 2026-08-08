import { WorkoutPlanBuilder } from "@/components/features/workout-plans/WorkoutPlanBuilder"
import { Button } from "@/components/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shared/ui/card"
import { Checkbox } from "@/components/shared/ui/checkbox"
import { CustomSelect } from "@/components/shared/ui/custom-select"
import { Form } from "@/components/shared/ui/form"
import { Input } from "@/components/shared/ui/input"
import { Separator } from "@/components/shared/ui/separator"
import { SimpleDatePicker } from "@/components/shared/ui/simple-datepicker"
import { SimpleField } from "@/components/shared/ui/simple-field"
import { Textarea } from "@/components/shared/ui/textarea"
import { FITNESS_GOAL_OPTIONS, LEVEL_OPTIONS } from "@/constants/common"
import { ROUTES } from "@/constants/routes"
import { daysPerWeekOptions, durationOptions } from "@/constants/workout-plan.constant"
import { useGetExerciseOptions } from "@/hooks/queries/exercises/useGetExerciseOptions"
import { useDetailPlan } from "@/hooks/queries/workout-plan/useDetailPlan"
import { useUpdatePlan } from "@/hooks/queries/workout-plan/useUpdatePlan"
import { ExerciseSelected, ScheduleItem, WorkoutPlanFormSchema } from "@/schemas/workout-plan.schema"
import { WorkoutFormData } from "@/types/workout-plan.type"
import { mapPlanDetailToForm, transformWorkoutPlanDTO } from "@/utils/workout-plan.util"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, ChevronRight, Loader2, XIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { generatePath, useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Helper function to map day names to numbers
const getDayOfWeekNumber = (dayId: string): number => {
  const dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }
  return dayMap[dayId] || 0
}

type WorkoutFormEditProps = {
  audience?: "admin" | "user"
}

export const WorkoutFormEdit = ({ audience = "user" }: WorkoutFormEditProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const { id } = useParams()
  const isAdmin = audience === "admin"

  const form = useForm<WorkoutFormData>({
    resolver: zodResolver(WorkoutPlanFormSchema),
    defaultValues: {
      name: "",
      goal: "",
      startDate: isAdmin ? undefined : new Date(),
      durationWeek: "",
      daysPerWeek: "",
      level: "BEGINNER",
      description: "",
      schedule: [],
    },
    mode: "onBlur",
  })

  const navigate = useNavigate()

  const watchedDuration = form.watch("durationWeek")
  const watchedDaysPerWeek = form.watch("daysPerWeek")

  const { fields: scheduleFields, replace: replaceSchedule } = useFieldArray({
    control: form.control,
    name: "schedule",
    keyName: "fieldId",
  })

  const { data: exerciseOptions } = useGetExerciseOptions()
  const {
    data: dataDetailPlan,
    isFetching: isFetchingPlanDetail,
    isError: isPlanDetailError,
    refetch: refetchPlanDetail,
  } = useDetailPlan(id)

  const { mutate: updatePlan, isPending: isUpdating } = useUpdatePlan({
    id: id || "",
    config: {
      onSuccess: (data) => {
        toast.success("Kế hoạch tập luyện đã được cập nhật thành công!")
        navigate(generatePath(ROUTES.WORKOUTS.DETAIL, { id: String(data.data) }))
      },
      onError: (error) => {
        toast.error(
          `Lỗi khi cập nhật kế hoạch tập luyện: ${error.response?.data?.error.message || "Đã có lỗi xảy ra."}`,
        )
      },
    },
  })

  console.log(form.formState.errors)

  const initializeSchedule = () => {
    const requiredDaysCount = Number(watchedDaysPerWeek)
    const hasEnoughDays = selectedDays.length === requiredDaysCount

    if (Number(watchedDuration) > 0 && requiredDaysCount > 0 && hasEnoughDays) {
      const currentSchedule = [...scheduleFields]
      const newSchedule: ScheduleItem[] = []

      // Tạo map để lưu các bài tập cũ theo weekNumber và dayOfWeek
      const existingExercisesMap = new Map<string, ExerciseSelected[]>()
      currentSchedule.forEach((item) => {
        const key = `${item.weekNumber}-${item.dayOfWeek}`
        existingExercisesMap.set(key, item.exercises)
      })

      for (let weekNumber = 1; weekNumber <= Number(watchedDuration); weekNumber++) {
        selectedDays.forEach((dayId) => {
          const dayOfWeek = getDayOfWeekNumber(dayId)
          const key = `${weekNumber}-${dayOfWeek}`

          // Giữ lại exercises cũ nếu có, nếu không thì tạo mới
          const exercises = existingExercisesMap.get(key) || [
            {
              exerciseId: "",
              sets: "3",
              reps: "10",
              duration: "",
              weight: "",
            },
          ]

          newSchedule.push({
            weekNumber,
            dayOfWeek,
            exercises,
          })
        })
      }

      replaceSchedule(newSchedule)
    }
  }

  useEffect(() => {
    if (dataDetailPlan) {
      const plan = mapPlanDetailToForm(dataDetailPlan)

      // Set từng field một cách rõ ràng
      form.setValue("name", plan.name)
      form.setValue("goal", plan.goal)
      form.setValue("startDate", plan.startDate)
      form.setValue("durationWeek", plan.durationWeek)
      form.setValue("daysPerWeek", plan.daysPerWeek)
      form.setValue("level", plan.level)
      form.setValue("description", plan.description || "")
      form.setValue("schedule", plan.schedule)

      if (!dataDetailPlan.isDefault && plan.startDate) {
        // Parse DD/MM/YYYY format hoặc Date object
        let startDate: Date

        if (typeof plan.startDate === "string") {
          // Nếu là string DD/MM/YYYY, parse thủ công
          const [day, month, year] = (plan.startDate as string).split("/").map(Number)
          startDate = new Date(year, month - 1, day)
        } else {
          // Nếu đã là Date object, dùng trực tiếp
          startDate = new Date(plan.startDate as Date)
        }

        console.log("plan Start date: ", plan.startDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        startDate.setHours(0, 0, 0, 0)
        console.log(startDate <= today)
        console.log("startDate:", startDate)
        console.log("today:", today)
        setHasStarted(startDate <= today)
      } else {
        setHasStarted(false) // Kế hoạch mẫu luôn cho phép chỉnh sửa
      }

      const extractedDays: string[] = []
      const dayMap = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
      }

      // Get unique dayOfWeek from schedule
      const uniqueDays = [...new Set(plan.schedule.map((item) => item.dayOfWeek))]
      uniqueDays.forEach((dayOfWeek) => {
        const dayId = dayMap[dayOfWeek]
        if (dayId) extractedDays.push(dayId)
      })

      setSelectedDays(extractedDays)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDetailPlan])

  useEffect(() => {
    const duration = Number(watchedDuration)
    const daysPerWeek = Number(watchedDaysPerWeek)

    // Nếu chưa có duration hoặc daysPerWeek, clear schedule
    if (!duration || !daysPerWeek) {
      if (scheduleFields.length > 0) {
        replaceSchedule([])
      }
      return
    }

    const hasEnoughDays = selectedDays.length === daysPerWeek
    const expectedScheduleItems = duration * daysPerWeek

    // Clear schedule nếu chưa chọn đủ ngày
    if (!hasEnoughDays) {
      if (scheduleFields.length > 0) {
        replaceSchedule([])
      }
      return
    }

    // Luôn cập nhật schedule khi số items không khớp (tăng hoặc giảm tuần)
    if (scheduleFields.length !== expectedScheduleItems) {
      initializeSchedule()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDuration, watchedDaysPerWeek])

  // Effect riêng để xử lý thay đổi selectedDays
  useEffect(() => {
    const daysPerWeek = Number(watchedDaysPerWeek)
    const duration = Number(watchedDuration)

    if (!daysPerWeek || !duration) return

    const hasEnoughDays = selectedDays.length === daysPerWeek

    if (hasEnoughDays) {
      // Cập nhật schedule khi thay đổi ngày được chọn
      initializeSchedule()
    } else if (!hasEnoughDays && scheduleFields.length > 0) {
      // Clear schedule nếu bỏ chọn ngày
      replaceSchedule([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDays])

  const handleBackToList = () => {
    if (!isAdmin) {
      navigate(ROUTES.WORKOUTS.MY_LIST)
    } else {
      navigate(ROUTES.WORKOUTS.SAMPLE_LIST)
    }
  }

  const handleSavePlan = (data: WorkoutFormData) => {
    const payload = transformWorkoutPlanDTO(data)
    updatePlan(payload)
  }

  const handleDaySelection = (dayId: string, checked: boolean) => {
    setSelectedDays((prev) => {
      let newDays = [...prev]
      const maxDays = Number(watchedDaysPerWeek) || 0

      if (checked) {
        if (!newDays.includes(dayId) && newDays.length < maxDays) {
          newDays.push(dayId)
        }
      } else {
        newDays = newDays.filter((d) => d !== dayId)
      }

      return newDays
    })
  }

  if (isFetchingPlanDetail) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-2xl border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isPlanDetailError || !dataDetailPlan) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
        <p className="font-medium text-destructive">Không thể tải thông tin kế hoạch</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => refetchPlanDetail()}>
          Thử tải lại
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSavePlan)} className="space-y-4">
        <div className={cn("flex items-center gap-4", isAdmin && "hidden")}>
          <Button type="button" variant="ghost" onClick={handleBackToList}>
            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
            Quay lại
          </Button>
        </div>
        <Card className={cn(isAdmin && "rounded-2xl border bg-card shadow-sm")}>
          <CardHeader className={cn(isAdmin && "border-b pb-5")}>
            <CardTitle>{isAdmin ? "Thông tin kế hoạch" : "Chỉnh sửa kế hoạch tập luyện"}</CardTitle>
            <CardDescription>
              {hasStarted
                ? "Kế hoạch đã bắt đầu - Chỉ có thể chỉnh sửa tên, mô tả, mục tiêu và cấp độ"
                : isAdmin
                  ? "Cập nhật thông tin cơ bản, lịch theo tuần và danh sách bài tập."
                  : "Chỉnh sửa kế hoạch tập luyện phù hợp với mục tiêu của bạn"}
            </CardDescription>
          </CardHeader>
          <CardContent className={cn("space-y-6", isAdmin && "pt-6")}>
            {/*Thêm cảnh báo nếu đã bắt đầu */}
            {hasStarted && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  Kế hoạch này đã bắt đầu. Bạn không thể chỉnh sửa kế hoạch sau khi đã bắt đầu. Vui lòng xem chi tiết
                  hoặc tạo kế hoạch mới.
                </p>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
              <SimpleField name="name" control={form.control} label="Tên kế hoạch" required>
                {(field) => <Input {...field} placeholder="VD: Kế hoạch giảm cân mùa hè" disabled={hasStarted} />}
              </SimpleField>

              <SimpleField name="goal" control={form.control} label="Mục tiêu" required>
                {(field) => (
                  <CustomSelect
                    key={`goal-${field.value}`}
                    options={FITNESS_GOAL_OPTIONS}
                    placeholder="Chọn mục tiêu"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={hasStarted}
                  />
                )}
              </SimpleField>

              {/* 🚫 Disable nếu đã bắt đầu */}
              <SimpleField name="durationWeek" control={form.control} label="Thời gian (tuần)" required>
                {(field) => (
                  <CustomSelect
                    key={`duration-${field.value}`}
                    options={durationOptions}
                    placeholder="Chọn thời gian"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={hasStarted} // ⭐ Disable
                  />
                )}
              </SimpleField>

              {!isAdmin && (
                <SimpleField name="startDate" control={form.control} label="Ngày bắt đầu" required>
                  {(field) => (
                    <SimpleDatePicker
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Chọn thời gian"
                      disabled={hasStarted} // ⭐ Disable
                    />
                  )}
                </SimpleField>
              )}

              <SimpleField name="daysPerWeek" control={form.control} label="Số ngày tập/tuần" required>
                {(field) => (
                  <CustomSelect
                    key={`days-${field.value}`}
                    options={daysPerWeekOptions}
                    placeholder="Chọn số ngày"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      const numValue = parseInt(value)
                      setSelectedDays((prev) => prev.slice(0, numValue))
                    }}
                    disabled={hasStarted} // ⭐ Disable
                  />
                )}
              </SimpleField>

              {/* ⭐ Disable nếu đã bắt đầu */}
              <SimpleField name="level" control={form.control} label="Cấp độ" required>
                {(field) => (
                  <CustomSelect
                    key={`level-${field.value}`}
                    options={LEVEL_OPTIONS}
                    placeholder="Chọn cấp độ"
                    value={field.value}
                    onChange={field.onChange}
                    disabled={hasStarted}
                  />
                )}
              </SimpleField>

              {/* 🚫 Disable checkboxes nếu đã bắt đầu */}
              <div className="md:col-span-2">
                <label className="text-sm text-foreground leading-5 h-5 font-bold">
                  Ngày tập trong tuần (tối đa {watchedDaysPerWeek} ngày)
                </label>
                <div className={cn("mt-2 flex flex-wrap gap-3", isAdmin && "rounded-xl border bg-muted/20 p-4")}>
                  {[
                    { id: "monday", label: "Thứ 2" },
                    { id: "tuesday", label: "Thứ 3" },
                    { id: "wednesday", label: "Thứ 4" },
                    { id: "thursday", label: "Thứ 5" },
                    { id: "friday", label: "Thứ 6" },
                    { id: "saturday", label: "Thứ 7" },
                    { id: "sunday", label: "Chủ nhật" },
                  ].map((day) => (
                    <div key={day.id} className={cn("flex items-center space-x-2", isAdmin && "rounded-lg bg-background px-3 py-2")}>
                      <Checkbox
                        id={day.id}
                        className="border-gray-300"
                        checked={selectedDays.includes(day.id)}
                        disabled={
                          hasStarted || // ⭐ Disable nếu đã bắt đầu
                          (!selectedDays.includes(day.id) && selectedDays.length >= Number(watchedDaysPerWeek))
                        }
                        onCheckedChange={(checked) => handleDaySelection(day.id, checked as boolean)}
                      />
                      <label
                        htmlFor={day.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedDays.length < Number(watchedDaysPerWeek) && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Vui lòng chọn {Number(watchedDaysPerWeek) - selectedDays.length} ngày nữa
                  </p>
                )}
              </div>
            </div>

            {/* ⭐ Disable textarea nếu đã bắt đầu */}
            <SimpleField name="description" control={form.control} label="Mô tả">
              {(field) => (
                <Textarea
                  {...field}
                  placeholder="Mô tả chi tiết về kế hoạch tập luyện..."
                  rows={5}
                  disabled={hasStarted}
                />
              )}
            </SimpleField>

            <Separator />

            {/* Workout Plan Builder - Chỉ hiển thị nếu chưa bắt đầu */}
            {!hasStarted && (
              <>
                {scheduleFields.length > 0 &&
                  exerciseOptions &&
                  selectedDays.length === Number(watchedDaysPerWeek) &&
                  Number(watchedDaysPerWeek) > 0 && <WorkoutPlanBuilder exerciseOptions={exerciseOptions} />}

                {/* Hiển thị message khi chưa chọn đủ ngày */}
                {Number(watchedDaysPerWeek) > 0 && selectedDays.length < Number(watchedDaysPerWeek) && (
                  <div className="rounded-xl border border-dashed bg-muted/30 py-10 text-center text-muted-foreground">
                    <p>Vui lòng chọn đủ {watchedDaysPerWeek} ngày trong tuần để tiếp tục thiết kế bài tập</p>
                    <p className="text-sm mt-1">
                      Đã chọn: {selectedDays.length}/{watchedDaysPerWeek} ngày
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ⭐ Hiển thị thông tin readonly nếu đã bắt đầu */}
            {hasStarted && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-black">Thông tin kế hoạch bài tập</h4>
                <p className="text-sm text-muted-foreground">
                  Kế hoạch bài tập không thể chỉnh sửa sau khi đã bắt đầu. Vui lòng xem chi tiết ở trang xem kế hoạch.
                </p>
              </div>
            )}

            <div className={cn("flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end", isAdmin && "border-t")}>
              <Button type="submit" disabled={isUpdating || hasStarted}>
                {isUpdating ? (
                  <Loader2 className={`w-4 h-4 mr-2 animate-spin`} />
                ) : (
                  <CheckCircle2 className={`w-4 h-4 mr-2`} />
                )}
                {isUpdating ? "Đang cập nhật..." : "Cập nhật kế hoạch"}
              </Button>
              <Button type="button" variant="outline" onClick={handleBackToList} disabled={isUpdating}>
                <XIcon />
                {hasStarted ? "Đóng" : "Hủy"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
