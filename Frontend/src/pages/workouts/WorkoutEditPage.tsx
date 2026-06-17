import { WorkoutFormEdit } from "@/components/features/workout-plans/WorkoutFormEdit"
import { PageLayout } from "@/layouts/PageLayout"

export function WorkoutEditPage() {
  return (
    <PageLayout title="Chỉnh sửa lịch tập">
      <WorkoutFormEdit />
    </PageLayout>
  )
}
