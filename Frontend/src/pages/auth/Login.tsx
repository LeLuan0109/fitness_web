import { LoginForm } from "@/components/features/auth/LoginForm"
import { PageLayout } from "@/layouts/PageLayout"

export function LoginPage() {
  return (
    <PageLayout title="COREFORM — Đăng nhập" variant="landing">
      <LoginForm />
    </PageLayout>
  )
}
