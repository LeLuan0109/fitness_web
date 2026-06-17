import { Badge } from "@/components/shared/ui/badge"

type MuscleGroupProps = {
  name: string
  isMain: boolean
}

export const MuscleGroup = ({ name, isMain }: MuscleGroupProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{name}</span>
      <Badge variant={isMain ? "default" : "outline"}>{isMain ? "Chính" : "Phụ"}</Badge>
    </div>
  )
}
