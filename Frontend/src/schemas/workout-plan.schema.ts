import { vStringOptional, vStringRequired } from "@/constants/validates"
import z from "zod"

const exerciseSelectedSchema = z.object({
  exerciseId: vStringRequired("Bài tập"),
  sets: vStringRequired("Số set").refine((val) => Number(val) >= 0, {
    message: "Số set không được âm",
  }),
  reps: vStringOptional().refine((val) => Number(val) >= 0, {
    message: "Số rep không được âm",
  }),
  duration: vStringOptional().refine((val) => Number(val) >= 0, {
    message: "Thời gian không được âm",
  }),
  weight: vStringOptional().refine((val) => Number(val) >= 0, {
    message: "Trọng lượng không được âm",
  }),
})

const scheduleItemSchema = z
  .object({
    id: z.number().optional(),
    weekNumber: z.number().min(1, "Số tuần phải bắt đầu từ 1"),
    dayOfWeek: z.number().min(0, "Ngày trong tuần không hợp lệ").max(6, "Ngày trong tuần từ 0-6"),
    exercises: z.array(exerciseSelectedSchema).min(1, "Mỗi ngày tập phải có ít nhất 1 bài tập"),
  })
  .superRefine((data, ctx) => {
    // Kiểm tra không có bài tập trùng lặp
    const exerciseIds = data.exercises.map((ex) => ex.exerciseId).filter((id) => id !== "")
    const seenIds = new Set<string>()
    const duplicates = new Set<string>()

    exerciseIds.forEach((id) => {
      if (seenIds.has(id)) {
        duplicates.add(id)
      }
      seenIds.add(id)
    })

    if (duplicates.size > 0) {
      // Tìm index của các bài tập trùng lặp và thêm lỗi cho từng bài
      data.exercises.forEach((exercise, index) => {
        if (duplicates.has(exercise.exerciseId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Không được chọn bài tập trùng lặp trong cùng một ngày",
            path: ["exercises", index, "exerciseId"],
          })
        }
      })
    }
  })

export const WorkoutPlanFormSchema = z
  .object({
    name: z.string().min(1, "Tên kế hoạch không được để trống"),
    goal: vStringRequired("Mục tiêu"),
    startDate: z
      .date({ invalid_type_error: "Ngày bắt đầu không hợp lệ" })
      .refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
        message: "Ngày bắt đầu không được trước ngày hôm nay",
      })
      .optional(),
    durationWeek: vStringRequired("Thời gian (tuần)"),
    daysPerWeek: vStringRequired("Số ngày tập (tuần)"),
    level: vStringRequired("Mức độ"),
    description: z.string().optional(),
    schedule: z
      .array(scheduleItemSchema)
      .min(1, "Lịch tập phải có ít nhất 1 ngày")
      .refine(
        (schedule) => {
          // Kiểm tra mỗi tuần không có ngày trùng lặp
          const weekGroups = schedule.reduce((acc, item) => {
            if (!acc[item.weekNumber]) acc[item.weekNumber] = []
            acc[item.weekNumber].push(item.dayOfWeek)
            return acc
          }, {} as Record<number, number[]>)

          for (const weekNumber in weekGroups) {
            const daysInWeek = weekGroups[weekNumber]
            const uniqueDays = [...new Set(daysInWeek)]
            if (uniqueDays.length !== daysInWeek.length) {
              return false
            }
          }
          return true
        },
        {
          message: "Không được có ngày trùng lặp trong cùng 1 tuần",
        },
      ),
  })
  .superRefine((data, ctx) => {
    const { schedule, daysPerWeek } = data
    const weekGroups = schedule.reduce((acc, item) => {
      if (!acc[item.weekNumber]) acc[item.weekNumber] = []
      acc[item.weekNumber].push(item.dayOfWeek)
      return acc
    }, {} as Record<number, number[]>)

    for (const weekNumber in weekGroups) {
      const daysInWeek = weekGroups[weekNumber]
      const uniqueDays = [...new Set(daysInWeek)]
      if (uniqueDays.length > Number(daysPerWeek)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Số ngày tập trong tuần không được vượt quá số ngày đã chọn",
          path: ["schedule"],
        })
        break
      }
    }
  })

export type ExerciseSelected = z.infer<typeof exerciseSelectedSchema>
export type ScheduleItem = z.infer<typeof scheduleItemSchema>
export type WorkoutFormDataType = z.infer<typeof WorkoutPlanFormSchema>
