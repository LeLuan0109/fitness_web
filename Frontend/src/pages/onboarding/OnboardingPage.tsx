import { OnboardingForm } from "@/components/features/onboarding/OnboardingForm"
import { PageLayout } from "@/layouts/PageLayout"

export function OnboardingPage() {
  return (
    <div className="coreform-app min-h-svh bg-background text-foreground">
      <PageLayout title="Onboarding">
        <OnboardingForm />
      </PageLayout>
    </div>
  )
}
