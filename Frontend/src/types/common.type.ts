import type { OrderType } from "@/types/enum"

import type { LucideIcon } from "lucide-react"
import { Role } from "./role.type"

export type Meta = {
  totalItems: number
  itemCount: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

type TError = {
  code: string
  message: string
  details: {
    property: string
  }[]
}

export type ResponseError = {
  error: TError
}

export type Response<T> = {
  success: boolean
  data?: T
  error?: TError
  meta?: Pagination
}

export type Pagination = {
  page: number
  pageSize: number
  total: number
  hasMore: boolean
  totalPages: number
}

export type Option = {
  value: string
  label: string
  disabled?: boolean
}

export type BaseSearchDTO = {
  page?: number
  limit?: number
  orderBy?: string
  orderDir?: OrderType
}

export type MenuItem = {
  title: string
  url?: string
  icon?: LucideIcon
  isActive?: boolean
  children?: MenuItem[]
  allowedRoles?: Role[] // ✅ Di chuyển xuống MenuItem level
}

export type MenuGroup = {
  group: string
  children: MenuItem[]
  // allowedRoles?: Role[]
}

export type ChartDataResponse = {
  date: string
  value1?: number
  value2?: number
}

export type MealKey = "breakfast" | "lunch" | "dinner" | "extra"
