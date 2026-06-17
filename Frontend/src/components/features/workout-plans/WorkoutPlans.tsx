import { TypographyH3 } from "@/components/shared/ui/typography"
import { SampleWorkout } from "./SampleWorkout"
import { OutstandingPlan } from "./OutstandingPlan"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/shared/ui/button"
import authStore from "@/stores/auth.store"
import { useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"

export function WorkoutPlans() {
  const isAdmin = authStore.use.auth().role?.name === "ADMIN"
  const navigate = useNavigate()

  const handleCreateSamplePlan = () => {
    navigate(ROUTES.WORKOUTS.CREATE)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH3 variant="bold">Kế hoạch tập luyện mẫu</TypographyH3>
          <p className="text-muted-foreground">Khám phá và tạo kế hoạch tập luyện phù hợp</p>
        </div>
        {isAdmin && <Button onClick={handleCreateSamplePlan}>Tạo kế hoạch tập luyện mẫu</Button>}
      </div>
      <OutstandingPlan />
      <Separator />
      <SampleWorkout />
    </div>
  )
}
