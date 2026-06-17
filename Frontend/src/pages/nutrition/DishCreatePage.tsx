import { DishForm } from "@/components/features/dishes/DishForm"
import { PageLayout } from "@/layouts/PageLayout"

export const DishCreatePage = () => {
  return (
    <PageLayout title="Tạo món ăn">
      <DishForm />
    </PageLayout>
  )
}
