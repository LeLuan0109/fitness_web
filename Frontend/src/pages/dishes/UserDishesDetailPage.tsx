import { UserDishDetail } from "@/components/features/dishes/UserDishDetail"
import { PageLayout } from "@/layouts/PageLayout"

export function UserDishesDetailPage() {
  return (
    <PageLayout title="Chi tiết món ăn">
      <UserDishDetail />
    </PageLayout>
  )
}
