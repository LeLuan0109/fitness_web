import { useEffect } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

import { ROLES } from "@/constants/roles.constant"
import { ROUTES } from "@/constants/routes"
import authStore from "@/stores/auth.store"

import AdminLayout from "./AdminLayout"
import UserLayout from "./UserLayout"

type ShellRole = "admin" | "user"

export default function AppLayout() {
  const auth = authStore.use.auth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = auth?.role?.name === ROLES.ADMIN
  const shell: ShellRole = isAdmin ? "admin" : "user"

  useEffect(() => {
    if (!auth) {
      document.documentElement.removeAttribute("data-shell")
      return
    }

    document.documentElement.dataset.shell = shell
    return () => {
      if (document.documentElement.dataset.shell === shell) {
        document.documentElement.removeAttribute("data-shell")
      }
    }
  }, [auth, shell])

  useEffect(() => {
    if (auth && location.pathname === "/" && isAdmin) {
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true })
    }
  }, [auth, isAdmin, location.pathname, navigate])

  if (!auth) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  }

  return isAdmin ? <AdminLayout /> : <UserLayout />
}
