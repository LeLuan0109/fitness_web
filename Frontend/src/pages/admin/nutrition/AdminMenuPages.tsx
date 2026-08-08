import { MenuDetail } from "@/components/features/nutrition/MenuDetail"
import { AdminSampleMenu } from "@/components/features/nutrition/AdminSampleMenu"
import { PageLayout } from "@/layouts/PageLayout"
import { MenuCreatePage } from "@/pages/nutrition/MenuCreatePage"
import { MenuEditPage } from "@/pages/nutrition/MenuEditPage"

export function AdminSampleMenuListPage() {
  return (
    <PageLayout title="Quản lý thực đơn mẫu">
      <AdminSampleMenu />
    </PageLayout>
  )
}

export function AdminSampleMenuDetailPage() {
  return (
    <PageLayout title="Chi tiết thực đơn mẫu">
      <MenuDetail audience="admin" isSample />
    </PageLayout>
  )
}

export function AdminMenuCreatePage() {
  return <MenuCreatePage audience="admin" />
}

export function AdminMenuEditPage() {
  return <MenuEditPage audience="admin" />
}
