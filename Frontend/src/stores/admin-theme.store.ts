import { create } from "zustand"
import { persist } from "zustand/middleware"

import createSelectors from "@/lib/zustand-selectors"

/** Admin accent color presets shown in the ThemeColorCustomizer. */
export const ADMIN_THEME_PRESETS = [
  { name: "Google Blue", hex: "#1a73e8" },
  { name: "Sky Blue", hex: "#0b57d0" },
  { name: "Deep Blue", hex: "#174ea6" },
  { name: "Light Blue", hex: "#4285f4" },
] as const

export type AdminThemePreset = (typeof ADMIN_THEME_PRESETS)[number]

const DEFAULT_ACCENT = "#1a73e8"
const DEFAULT_NAME = "Google Blue"

type AdminThemeState = {
  accent: string
  themeName: string
  setAccent: (hex: string, name?: string) => void
}

/** Convert "#rrggbb" → "r g b" for use in rgba() glass/border rules. */
export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "").trim()
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean
  const int = parseInt(full, 16)
  if (Number.isNaN(int) || full.length !== 6) return "14 165 233"
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `${r} ${g} ${b}`
}

/** Update admin-only variables without changing the generic user theme. */
export function applyAdminAccent(hex: string) {
  const root = document.documentElement
  root.style.setProperty("--admin-accent", hex)
  root.style.setProperty("--admin-accent-rgb", hexToRgbTriplet(hex))
  root.style.setProperty("--admin-accent-hover", `${hex}cc`)
}

const useAdminThemeStoreBase = create<AdminThemeState>()(
  persist(
    (set) => ({
      accent: DEFAULT_ACCENT,
      themeName: DEFAULT_NAME,
      setAccent: (hex, name) => {
        applyAdminAccent(hex)
        set({ accent: hex, themeName: name ?? "Custom" })
      },
    }),
    {
      name: "admin-theme",
      onRehydrateStorage: () => (state) => {
        if (state?.accent) applyAdminAccent(state.accent)
      },
    },
  ),
)

const adminThemeStore = createSelectors(useAdminThemeStoreBase)
export default adminThemeStore
