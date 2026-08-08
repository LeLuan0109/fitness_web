import { PostDetail } from "@/components/features/community/PostDetail"
import { RolePageShell } from "@/components/shared/coreform/RolePageShell"
import { MessageSquareText } from "lucide-react"

export function UserPostDetailPage() {
  return (
    <RolePageShell
      title="Chi tiết bài viết"
      heading="Chi tiết bài viết"
      description="Tham gia thảo luận và kết nối với tác giả bài viết."
      icon={MessageSquareText}
    >
      <PostDetail />
    </RolePageShell>
  )
}
