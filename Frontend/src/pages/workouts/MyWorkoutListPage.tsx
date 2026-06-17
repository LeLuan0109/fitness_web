import { MyWorkout } from "@/components/features/workout-plans/MyWorkout"
import { PageLayout } from "@/layouts/PageLayout"

export function MyWorkoutListPage() {
  return (
    <PageLayout title="Lịch tập của tôi">
      <MyWorkout />
    </PageLayout>
  )
}
