import { CoreformLiftLoader } from "@/components/shared/coreform"
import { useEffect, type ReactNode } from "react"

import { useGetBasicInfo } from "@/hooks/queries/auth/useAuthQuery"
import authStore from "@/stores/auth.store"
import { localStorageServices } from "@/utils/localStorageServices.ts"

export default function AppProvider({ children }: { readonly children: ReactNode }) {
  const accessToken = localStorageServices.getAccessToken()
  const setAuth = authStore.use.setAuth()
  const setIsInitialize = authStore.use.setIsInitialize()
  const isInitialize = authStore.use.isInitialize()

  const { data: userProfile, isSuccess } = useGetBasicInfo({
    config: {
      enabled: !!accessToken,
    },
  })

  useEffect(() => {
    if (isSuccess && userProfile?.data) {
      setAuth({
        id: userProfile.data.id,
        email: userProfile.data.email,
        username: userProfile.data.username,
        name: userProfile.data.name,
        avatar: userProfile.data.avatar,
        role: userProfile.data.role,
        isOnboardingCompleted: userProfile.data.onboardingCompleted,
      })
      setIsInitialize("success")
    } else {
      setIsInitialize("error")
    }
  }, [isSuccess, userProfile, setAuth, setIsInitialize])

  if (isInitialize === "isLoading" && accessToken) {
    return (
      <div className="coreform-app flex min-h-svh items-center justify-center bg-cream">
        <CoreformLiftLoader size="lg" label="Đang tải hồ sơ..." />
      </div>
    )
  }

  return <>{children}</>
}
