import { Profile } from "@/components/features/profile/Profile"
import { RolePageShell } from "@/components/shared/coreform/RolePageShell"
import { UserRound } from "lucide-react"

export function UserProfilePage() {
  return (
    <RolePageShell
      title="Hồ sơ cá nhân"
      heading="Hồ sơ cá nhân"
      description="Quản lý thông tin cá nhân và theo dõi các chỉ số gần đây."
      icon={UserRound}
    >
      <Profile />
    </RolePageShell>
  )
}
