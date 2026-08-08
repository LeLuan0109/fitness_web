import type { ReactNode } from "react"

import { ROLES } from "@/constants/roles.constant"
import authStore from "@/stores/auth.store"

type RolePageProps = {
  admin: ReactNode
  user: ReactNode
}

export function RolePage({ admin, user }: RolePageProps) {
  const role = authStore.use.auth()?.role?.name

  return role === ROLES.ADMIN ? admin : user
}
