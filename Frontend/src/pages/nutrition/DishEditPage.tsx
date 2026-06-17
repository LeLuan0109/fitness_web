import { DishForm } from "@/components/features/dishes/DishForm"
import { PageLayout } from "@/layouts/PageLayout"

export const DishEditPage = () => {
  return (
    <PageLayout title="Cập nhật món ăn">
      <DishForm isEdit />
    </PageLayout>
  )
}
