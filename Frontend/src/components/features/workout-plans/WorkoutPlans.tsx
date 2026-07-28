import { CoreformPageHeader, CoreformPrimaryButton } from "@/components/shared/coreform"
import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store"
import { useNavigate } from "react-router"
import { SampleWorkout } from "./SampleWorkout"
import { OutstandingPlan } from "./OutstandingPlan"

export function WorkoutPlans() {
  const isAdmin = authStore.use.auth().role?.name === "ADMIN"
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
          isAdmin ? (
            <CoreformPrimaryButton onClick={handleCreateSamplePlan}>
              Tạo kế hoạch mẫu
            </CoreformPrimaryButton>
          ) : undefined
        }
      />
      <OutstandingPlan />
      <div className="border-t border-border/40 pt-8">
        <SampleWorkout />
      </div>
    </div>
  )
}
