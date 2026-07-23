import { FoodDiary } from "@/components/features/nutrition/FoodDiary"
import { ProgressOverviewCard } from "@/components/features/progress/ProgressOverviewCard"
import { PageLayout } from "@/layouts/PageLayout"

export function FoodDiaryPage() {
  return (
    <PageLayout title="Nhật ký ăn uống">
      <div className="flex flex-col gap-6">
        <ProgressOverviewCard />
        <FoodDiary />
      </div>
    </PageLayout>
  )
}
