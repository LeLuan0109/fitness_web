import type { LucideIcon } from "lucide-react"
import { Role } from "@/types/role.type"

export interface MenuItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: MenuItem[]
}

export interface MenuGroup {
  group: string
  items: MenuItem[]
  allowedRoles?: Role[]
}
