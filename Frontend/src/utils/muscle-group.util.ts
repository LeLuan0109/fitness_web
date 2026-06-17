import { MuscleGroupType } from "@/types/muscle-group.type"

export const mapMuscleGroupsCompact = (
  primaryMuscles: string[] = [],
  secondaryMuscles: string[] = [],
): MuscleGroupType[] => {
  return [
    ...primaryMuscles.map((muscle) => ({ name: muscle, isMain: true })),
    ...secondaryMuscles.map((muscle) => ({ name: muscle, isMain: false })),
  ]
}
