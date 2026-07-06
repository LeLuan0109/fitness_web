import { RegisterForm } from "@/components/features/auth/RegisterForm"
import { PageLayout } from "@/layouts/PageLayout"

export function RegisterPage() {
  return (
    <PageLayout title="COREFORM — Đăng ký" variant="landing">
      <RegisterForm />
    </PageLayout>
  )
}
