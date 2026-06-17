import { DishesList } from "@/components/features/dishes/DishesList"
import { PageLayout } from "@/layouts/PageLayout"

export function DishesListPage() {
  return (
    <PageLayout title="Danh sách món ăn">
      <DishesList />
    </PageLayout>
  )
}
