import { MenuDetail } from "@/components/features/nutrition/MenuDetail"
import { SampleMenu } from "@/components/features/nutrition/SampleMenu"
import { PageLayout } from "@/layouts/PageLayout"
import { MenuCreatePage } from "@/pages/nutrition/MenuCreatePage"
import { MenuEditPage } from "@/pages/nutrition/MenuEditPage"

export function UserSampleMenuListPage() {
  return (
    <PageLayout title="Thực đơn mẫu">
      <SampleMenu audience="user" />
    </PageLayout>
  )
}

export function UserSampleMenuDetailPage() {
  return (
    <PageLayout title="Chi tiết thực đơn mẫu">
      <MenuDetail audience="user" isSample />
    </PageLayout>
  )
}

export function UserMenuCreatePage() {
  return <MenuCreatePage audience="user" />
}

export function UserMenuEditPage() {
  return <MenuEditPage audience="user" />
}
