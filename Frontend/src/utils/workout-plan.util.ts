import { DATE_TIME_FORMAT } from "@/constants/common"
import { PlanDetailResponse, WorkoutFormData, WorkoutPlanRequest } from "@/types/workout-plan.type"
import { parse } from "date-fns"
import { formatDateddMMyyyy } from "./utils"

export const getFitnessGoalName = (goal: string) => {
  switch (goal) {
    case "LOSE_WEIGHT":
      return "Giảm cân"
    case "GAIN_WEIGHT":
      return "Tăng cân"
    case "MUSCLE_GAIN":
      return "Tăng cơ"
    case "SHAPE_BODY":
      return "Giữ dáng"
    default:
      return "Khác"
  }
}

export const getDayName = (dayOfWeek: number) => {
  const days = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
  return days[dayOfWeek] || `Ngày ${dayOfWeek}`
}

export const transformWorkoutPlanDTO = (data: WorkoutFormData): WorkoutPlanRequest => {
  return {
    name: data.name,
    description: data.description,
    goal: data.goal,
    durationWeek: Number(data.durationWeek),
    daysPerWeek: Number(data.daysPerWeek),
    level: data.level,
    startDate: data.startDate ? formatDateddMMyyyy(data.startDate) : null,
    schedule: data.schedule.map((day) => ({
      weekNumber: day.weekNumber,
      dayOfWeek: day.dayOfWeek,
      exercises: day.exercises.map((exercise) => ({
        exerciseId: Number(exercise.exerciseId),
        sets: exercise.sets ? Number(exercise.sets) : null,
        reps: exercise.reps ? Number(exercise.reps) : null,
        weight: exercise.weight ? Number(exercise.weight) : null,
        duration: exercise.duration ? Number(exercise.duration) : null,
      })),
    })),
  }
}

export const mapPlanDetailToForm = (plan: PlanDetailResponse): WorkoutFormData => {
  return {
    name: plan?.name ?? "",
    goal: plan?.targetGoal ?? "",
    startDate: plan?.startDate ? parse(plan?.startDate, DATE_TIME_FORMAT.DATE_FORMAT_SLASH, new Date()) : new Date(),
    durationWeek: String(plan?.durationWeek ?? ""),
    daysPerWeek: String(plan?.daysPerWeek ?? ""),
    level: plan?.difficultyLevel ?? "",
    description: plan?.description ?? "",
    schedule:
      plan?.weeks?.flatMap(
        (week) =>
          week.days?.map((day) => ({
            id: day.id,
            weekNumber: week?.weekNumber,
            dayOfWeek: day?.dayOfWeek,
            exercises:
              day?.exercises?.map((ex) => ({
                exerciseId: (ex.exerciseId ?? "").toString(),
                sets: (ex.sets ?? "").toString(),
                reps: (ex.reps ?? "").toString(),
                duration: (ex.duration ?? "").toString(),
                weight: (ex.weight ?? "").toString(),
                logs: ex.logs,
              })) ?? [],
          })) ?? [],
      ) ?? [],
  }
}
