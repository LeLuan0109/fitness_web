import { Response } from "@/types/common.type"
import { ExerciseData, ExerciseResponse, ExercisesListData } from "@/types/exercises.type"

export const transformExercisesListData = (response: Response<ExerciseResponse[]>): ExercisesListData => {
  return {
    data: response.data.map((exercise) => ({
      id: exercise.id,
      name: exercise?.name ?? "",
      level: exercise?.level ?? "",
      thumbnail: exercise?.thumbnail ?? "",
      description: exercise?.description ?? "",
      muscleGroups: [...exercise.primaryMuscles, ...exercise.secondaryMuscles],
      trainingType: exercise?.trainingType ?? "",
    })),
    pagination: response.meta,
  }
}

export const transformExerciseData = (response: Response<ExerciseResponse[]>): ExerciseData[] => {
  return response?.data.map((exercise) => ({
    id: exercise.id,
    name: exercise?.name ?? "",
    level: exercise?.level ?? "",
    thumbnail: exercise?.thumbnail ?? "",
    description: exercise?.description ?? "",
    trainingType: exercise?.trainingType ?? "",
    muscleGroups: exercise?.muscleGroups ?? [],
  }))
}
