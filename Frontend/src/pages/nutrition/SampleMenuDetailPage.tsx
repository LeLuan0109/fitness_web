import { MenuDetail } from "@/components/features/nutrition/MenuDetail"
import { PageLayout } from "@/layouts/PageLayout"

export const SampleMenuDetailPage = () => {
  return (
    <PageLayout title="Chi tiết thực đơn mẫu">
      <MenuDetail isSample />
    </PageLayout>
  )
}
