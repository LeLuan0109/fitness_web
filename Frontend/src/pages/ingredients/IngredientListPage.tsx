import { IngredientList } from "@/components/features/ingredients/IngredientList"
import { PageLayout } from "@/layouts/PageLayout"

export function IngredientListPage() {
  return (
    <PageLayout title="Danh sách nguyên liệu">
      <IngredientList />
    </PageLayout>
  )
}
