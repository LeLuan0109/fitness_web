import { UserList } from "@/components/features/user/UserList"
import { PageLayout } from "@/layouts/PageLayout"

export const UserListPage = () => {
  return (
    <PageLayout title="Danh sách người dùng">
      <UserList />
    </PageLayout>
  )
}
