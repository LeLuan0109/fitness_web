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
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-500" />
        <h3>Nổi bật</h3>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
