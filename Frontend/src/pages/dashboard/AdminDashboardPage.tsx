import { PageLayout } from "@/layouts/PageLayout"
import { AdminDashboard } from "../../components/features/dashboard/admin/AdminDashboard"

export function AdminDashboardPage() {
  return (
    <PageLayout title="Trang chủ admin">
      <AdminDashboard />
    </PageLayout>
  )
}
