import { PersonalMenu } from "@/components/features/nutrition/PersonalMenu"
import { PageLayout } from "@/layouts/PageLayout"

export function MyMenuPage() {
  return (
    <PageLayout title="Thực đơn của tôi">
      <PersonalMenu />
    </PageLayout>
  )
}
