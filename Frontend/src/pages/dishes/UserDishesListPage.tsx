import { UserDishesList } from "@/components/features/dishes/UserDishesList"
import { PageLayout } from "@/layouts/PageLayout"

export function UserDishesListPage() {
  return (
    <PageLayout title="Danh sách món ăn">
      <UserDishesList />
    </PageLayout>
  )
}
