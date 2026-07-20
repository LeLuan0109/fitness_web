export interface LoggedExercise {
  id: number
  name: string
}

export interface ProgressPoint {
  date: string
  maxWeight: number
  maxReps: number
  estimatedOneRm: number
  volume: number
}

export interface ExerciseProgress {
  exerciseId: number
  exerciseName: string
  points: ProgressPoint[]
  bestWeight: number
  bestReps: number
  bestEstimatedOneRm: number
  bestDate: string | null
}
