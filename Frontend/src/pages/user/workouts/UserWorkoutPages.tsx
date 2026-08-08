import { WorkoutDetail } from "@/components/features/workout-plans/WorkoutDetail"
import { WorkoutFormCreate } from "@/components/features/workout-plans/WorkoutFormCreate"
import { WorkoutFormEdit } from "@/components/features/workout-plans/WorkoutFormEdit"
import { WorkoutPlans } from "@/components/features/workout-plans/WorkoutPlans"
import { PageLayout } from "@/layouts/PageLayout"

export function UserSampleWorkoutListPage() {
  return (
    <PageLayout title="Lịch tập mẫu">
      <WorkoutPlans audience="user" />
    </PageLayout>
  )
}

export function UserWorkoutDetailPage() {
  return (
    <PageLayout title="Chi tiết lịch tập">
      <WorkoutDetail audience="user" />
    </PageLayout>
  )
}

export function UserWorkoutCreatePage() {
  return (
    <PageLayout title="Tạo lịch tập">
      <WorkoutFormCreate audience="user" />
    </PageLayout>
  )
}

export function UserWorkoutEditPage() {
  return (
    <PageLayout title="Chỉnh sửa lịch tập">
      <WorkoutFormEdit audience="user" />
    </PageLayout>
  )
}
