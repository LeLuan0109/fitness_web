import { ChangePasswordForm } from "@/components/features/auth/ChangePasswordForm"
import { PageLayout } from "@/layouts/PageLayout"

export function ChangePasswordPage() {
  return (
    <PageLayout title="Change Password">
      <ChangePasswordForm />
    </PageLayout>
  )
}
