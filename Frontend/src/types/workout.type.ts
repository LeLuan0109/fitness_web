export type WorkoutPlan = {
  id: number
  name: string
  description: string
  goal: string
  duration: string
  daysPerWeek: number
  difficulty: string
  calories?: number
  users?: number
  rating?: number
  featured?: boolean
  createdAt?: string
  weeks?: Array<{
    week: number
    days: Array<{
      day: number
      exercises: string[]
    }>
  }>
}
