import { ForgotPasswordForm } from "@/components/features/auth/ForgotPasswordForm"
import { PageLayout } from "@/layouts/PageLayout"

export function ForgotPasswordPage() {
  return (
    <PageLayout title="Forgot Password">
      <ForgotPasswordForm />
    </PageLayout>
  )
}
