import { create } from "zustand"
import { persist } from "zustand/middleware"

import createSelectors from "@/lib/zustand-selectors"

/** Admin accent color presets shown in the ThemeColorCustomizer. */
export const ADMIN_THEME_PRESETS = [
  { name: "Cyber Purple", hex: "#8b5cf6" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Neon Blue", hex: "#2563eb" },
  { name: "Sunset Orange", hex: "#f97316" },
] as const

export type AdminThemePreset = (typeof ADMIN_THEME_PRESETS)[number]

const DEFAULT_ACCENT = "#6366f1"
const DEFAULT_NAME = "Indigo"

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
  if (Number.isNaN(int) || full.length !== 6) return "99 102 241"
  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `${r} ${g} ${b}`
}

/**
 * Push the accent color into CSS custom properties on :root so that every
 * scoped rule under `.coreform-admin` (buttons, active menu, border glow,
 * chart series, canvas particles, selection) updates instantly without reload.
 */
export function applyAdminAccent(hex: string) {
  const root = document.documentElement
  root.style.setProperty("--accent", hex)
  root.style.setProperty("--accent-rgb", hexToRgbTriplet(hex))
  root.style.setProperty("--primary", hex)
  root.style.setProperty("--ring", hex)
  root.style.setProperty("--button-primary", hex)
  root.style.setProperty("--accent-hover", `${hex}cc`)
  root.style.setProperty("--sidebar-primary", hex)
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
