import { UserExerciseList } from "@/components/features/exercises/UserExerciseList"
import { PageLayout } from "@/layouts/PageLayout"

export function UserExerciseListPage() {
  return (
    <PageLayout title="Danh sách bài tập">
      <UserExerciseList />
    </PageLayout>
  )
}
