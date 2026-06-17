import { MuscleGroup } from "@/components/features/exercises/MuscleGroup"
import { Step } from "@/components/features/exercises/Step"
import { Badge } from "@/components/shared/ui/badge"
import { Separator } from "@/components/shared/ui/separator"
import { MuscleGroupType } from "@/types/muscle-group.type"
import { Dumbbell, Play, Target } from "lucide-react"

type ExerciseInstructionProps = {
  step: string[]
  equipment: string[]
  muscleGroups: MuscleGroupType[]
}

export const ExerciseInstruction = ({ step, equipment, muscleGroups }: ExerciseInstructionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="mb-3 flex items-center gap-2">
        <Play className="w-5 h-5 text-primary" />
        Hướng dẫn thực hiện
      </h3>
      <div className="space-y-3">
        {step.map((description, idx) => (
          <Step key={idx + 1} stepNumber={idx + 1} description={description} />
        ))}
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 flex items-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" />
          Thiết bị cần thiết
        </h3>
        <div className="flex flex-wrap gap-2">
          {equipment.map((item, idx) => (
            <Badge key={idx + 1} variant="outline">
              {item}
            </Badge>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Nhóm cơ tác động
        </h3>
        <div className="space-y-2">
          {muscleGroups.map((mg, index) => (
            <MuscleGroup key={mg.name + index} name={mg.name} isMain={Boolean(mg.isMain)} />
          ))}
        </div>
      </div>
    </div>
  )
}
