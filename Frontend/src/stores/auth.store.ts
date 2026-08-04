import { create } from "zustand"
import { persist } from "zustand/middleware"

import { ROUTES } from "@/constants/routes"
import { queryClient } from "@/lib/react-query"
import createSelectors from "@/lib/zustand-selectors"
import { router } from "@/router/router"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Role } from "@/types/role.type"

export type TAuth = {
  id: string
  email: string | undefined
  name: string | undefined
  username: string | undefined
  avatar: string | undefined
  role: Role | undefined
  isOnboardingCompleted: boolean
}

type AuthAction = {
  setAuth: (data: TAuth | undefined) => void
  setIsInitialize: (data: "success" | "error" | "isLoading") => void
  clearAuth: () => void
}

type AuthState = {
  auth: TAuth | undefined
  isInitialize: "success" | "error" | "isLoading"
}

const useAuthStore = create<AuthState & AuthAction>()(
  persist(
    (set) => ({
      auth: undefined,
      isInitialize: "isLoading",
      setAuth: (user) => set((state) => ({ ...state, auth: user })),
      setIsInitialize: (data) => set((state) => ({ ...state, isInitialize: data })),
      clearAuth: () => {
        localStorage.clear()
        set((state) => ({ ...state, auth: undefined }))
        queryClient.clear()
        router.navigate(ROUTES.AUTH.LOGIN)
      },
    }),
    {
      name: "auth_store",
    },
  ),
)

export default createSelectors(useAuthStore)
