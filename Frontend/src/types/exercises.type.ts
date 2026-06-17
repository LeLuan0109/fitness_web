import { Pagination } from "@/types/common.type"

export type ExerciseSearchParams = {
  search?: string
  level?: string
  typeId?: string
  muscleId?: string
  page?: number
  size?: number
}

export type ExerciseResponse = {
  id: number
  name: string
  level: string
  thumbnail: string
  videoUrl: string
  description: string
  benefit: string
  trainingType: string
  muscleGroups: string[]
  equipments: string[]
  primaryMuscles: string[]
  secondaryMuscles: string[]
  steps: string[]
  tips: string[]
  mistakes: string[]
  benefits: string[]
}

export type ExerciseDetailFormResponse = {
  id: number
  name: string
  level: string
  thumbnail: string
  videoUrl: string
  description: string
  met: number
  benefit: string
  trainingTypeId: number
  equipments: number[]
  primaryMusclesIds: number[]
  secondaryMusclesIds: number[]
  steps: string[]
  tips: string[]
  mistakes: string[]
  benefits: string[]
}

export type ExerciseData = Pick<
  ExerciseResponse,
  "id" | "name" | "level" | "thumbnail" | "description" | "trainingType" | "muscleGroups"
>

export type ExercisesListData = {
  data: ExerciseData[]
  pagination: Pagination
}

export type Exercise = {
  id: number
  name: string
  sets: number
  intensity: string | null
  type: string | null
  difficulty: string
}

export type ExerciseRequest = {
  name: string
  level: string
  description: string
  trainingTypeId: number
  met: number
  muscleGroupIds?: number[]
  thumbnail?: File
  video?: File
  equipmentIds: number[]
  primaryMuscleGroupIds: number[]
  secondaryMuscleGroupIds: number[]
  steps: string[]
  tips: string[]
  mistakes: string[]
  benefits: string[]
}
