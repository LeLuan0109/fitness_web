import { ErrorBoundary } from "react-error-boundary"
import { Navigate } from "react-router-dom"

import { ErrorFallback } from "@/components/shared/common/error-fallback"
import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store.ts"

import type { ReactNode } from "react"

export const GuestRoute = ({ children }: { children: ReactNode }) => {
  const auth = authStore.use.auth()

  if (auth) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
}
