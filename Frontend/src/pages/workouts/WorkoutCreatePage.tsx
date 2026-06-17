import { WorkoutFormCreate } from "@/components/features/workout-plans/WorkoutFormCreate"
import { PageLayout } from "@/layouts/PageLayout"

export function WorkoutCreatePage() {
  return (
    <PageLayout title="Tạo lịch tập">
      <WorkoutFormCreate />
    </PageLayout>
  )
}
