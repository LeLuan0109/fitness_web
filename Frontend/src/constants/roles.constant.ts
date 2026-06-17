import { Role } from "@/types/role.type"

// Role constants để dễ sử dụng
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const

// Helper function để tạo Role object
export const createRole = (name: string): Role => ({
  id: 0, // ID không quan trọng khi so sánh role name
  name,
})

// Predefined roles
export const ROLE_ADMIN = createRole(ROLES.ADMIN)
export const ROLE_USER = createRole(ROLES.USER)
