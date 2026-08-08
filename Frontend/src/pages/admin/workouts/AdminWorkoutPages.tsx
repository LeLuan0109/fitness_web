import { WorkoutDetail } from "@/components/features/workout-plans/WorkoutDetail"
import { WorkoutFormCreate } from "@/components/features/workout-plans/WorkoutFormCreate"
import { WorkoutFormEdit } from "@/components/features/workout-plans/WorkoutFormEdit"
import { AdminWorkoutPlans } from "@/components/features/workout-plans/AdminWorkoutPlans"
import { PageLayout } from "@/layouts/PageLayout"

export function AdminSampleWorkoutListPage() {
  return (
    <PageLayout title="Quản lý lịch tập mẫu">
      <AdminWorkoutPlans />
    </PageLayout>
  )
}

export function AdminWorkoutDetailPage() {
  return (
    <PageLayout title="Chi tiết lịch tập mẫu">
      <WorkoutDetail audience="admin" />
    </PageLayout>
  )
}

export function AdminWorkoutCreatePage() {
  return (
    <PageLayout title="Tạo lịch tập mẫu">
      <WorkoutFormCreate audience="admin" />
    </PageLayout>
  )
}

export function AdminWorkoutEditPage() {
  return (
    <PageLayout title="Chỉnh sửa lịch tập mẫu">
      <WorkoutFormEdit audience="admin" />
    </PageLayout>
  )
}
