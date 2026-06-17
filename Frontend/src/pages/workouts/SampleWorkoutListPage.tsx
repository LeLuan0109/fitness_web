import { WorkoutPlans } from "@/components/features/workout-plans/WorkoutPlans"
import { PageLayout } from "@/layouts/PageLayout"

export function WorkoutListPage() {
  return (
    <PageLayout title="Lịch tập mẫu">
      <WorkoutPlans />
    </PageLayout>
  )
}
