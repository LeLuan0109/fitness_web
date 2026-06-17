import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store"
import { Role } from "@/types/role.type"
import { ReactElement } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Navigate } from "react-router-dom"
import { ErrorFallback } from "../common/error-fallback"

type ProtectedRouteProps = {
  children: ReactElement
  requireOnboarding?: boolean
  allowedRoles?: Role[]
}

export const ProtectedRoute = ({ children, requireOnboarding = true, allowedRoles }: ProtectedRouteProps) => {
  const auth = authStore.use.auth()

  if (!auth) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  if (requireOnboarding && !auth.isOnboardingCompleted) {
    return <Navigate to={ROUTES.ONBOARDING} replace />
  }

  // Kiểm tra quyền truy cập dựa trên role.name
  if (allowedRoles && allowedRoles.length > 0 && auth.role) {
    const hasPermission = allowedRoles.some((allowedRole) => allowedRole.name === auth.role?.name)

    if (!hasPermission) {
      return <Navigate to={ROUTES.FORBIDDEN} replace />
    }
  }

  return <ErrorBoundary fallback={<ErrorFallback />}>{children}</ErrorBoundary>
}
