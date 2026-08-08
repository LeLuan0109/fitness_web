import { CoreformPageHeader, CoreformPrimaryButton } from "@/components/shared/coreform"
import { ROUTES } from "@/constants/routes"
import { useNavigate } from "react-router"
import { SampleWorkout } from "./SampleWorkout"
import { OutstandingPlan } from "./OutstandingPlan"

type WorkoutPlansProps = {
  audience?: "admin" | "user"
}

export function WorkoutPlans({ audience = "user" }: WorkoutPlansProps) {
  const navigate = useNavigate()

  const handleCreateSamplePlan = () => {
    navigate(ROUTES.WORKOUTS.CREATE)
  }

  return (
    <div className="space-y-8">
      <CoreformPageHeader
        title="Kế hoạch tập luyện mẫu"
        description="Khám phá và tạo kế hoạch tập luyện phù hợp với mục tiêu của bạn."
        action={
          audience === "admin" ? (
            <CoreformPrimaryButton onClick={handleCreateSamplePlan}>
              Tạo kế hoạch mẫu
            </CoreformPrimaryButton>
          ) : undefined
        }
      />
      <OutstandingPlan />
      <div className="border-t border-border/40 pt-8">
        <SampleWorkout audience={audience} />
      </div>
    </div>
  )
}
