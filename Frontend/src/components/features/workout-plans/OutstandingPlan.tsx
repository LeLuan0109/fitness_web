import { useGetOutstandingPlans } from "@/hooks/queries/workout-plan/useGetOutstandingPlans"
import { Star } from "lucide-react"
import { WorkoutCard } from "./WorkoutCard"
import { PlanListResponse } from "@/types/workout-plan.type"
import { generatePath, useNavigate } from "react-router"
import { ROUTES } from "@/constants/routes"

export function OutstandingPlan() {
  const navigate = useNavigate()
  const { data: outstandingPlans = [] } = useGetOutstandingPlans()
  const handleWorkoutClick = (plan: PlanListResponse) => {
    navigate(generatePath(ROUTES.WORKOUTS.DETAIL, { id: plan.id.toString() }))
  }

  return (
    <div>
      <div className="mb-5 flex items-center gap-2">
        <Star className="size-5 text-clay" />
        <h3 className="font-display text-lg font-medium text-earth">Nổi bật</h3>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {outstandingPlans?.map((plan) => (
          <WorkoutCard
            key={plan.id}
            plan={plan}
            showFeaturedIcon={true}
            onViewDetail={() => handleWorkoutClick(plan)}
          />
        ))}
      </div>
    </div>
  )
}
