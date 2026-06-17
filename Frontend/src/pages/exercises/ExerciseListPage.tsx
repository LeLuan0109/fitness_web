import { ExerciseList } from "@/components/features/exercises/ExerciseList"
import { PageLayout } from "@/layouts/PageLayout"

export function ExerciseListPage() {
  return (
    <PageLayout title="Danh sách bài tập">
      <ExerciseList />
    </PageLayout>
  )
}
