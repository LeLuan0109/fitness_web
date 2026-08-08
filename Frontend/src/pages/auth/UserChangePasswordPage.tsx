import { ChangePasswordForm } from "@/components/features/auth/ChangePasswordForm"
import { RolePageShell } from "@/components/shared/coreform/RolePageShell"
import { LockKeyhole } from "lucide-react"

export function UserChangePasswordPage() {
  return (
    <RolePageShell
      title="Đổi mật khẩu"
      heading="Đổi mật khẩu"
      description="Cập nhật mật khẩu định kỳ để giữ tài khoản của bạn an toàn."
      icon={LockKeyhole}
    >
      <ChangePasswordForm showHeader={false} />
    </RolePageShell>
  )
}
