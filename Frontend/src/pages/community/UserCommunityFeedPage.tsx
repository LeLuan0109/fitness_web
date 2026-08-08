import { CommunityFeed } from "@/components/features/community/feed"
import { RolePageShell } from "@/components/shared/coreform/RolePageShell"
import { Users } from "lucide-react"

export function UserCommunityFeedPage() {
  return (
    <RolePageShell
      title="Bài viết cộng đồng"
      heading="Cộng đồng"
      description="Chia sẻ tiến trình và kết nối với cộng đồng vận động viên."
      icon={Users}
    >
      <CommunityFeed showHeader={false} />
    </RolePageShell>
  )
}
