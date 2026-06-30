import { create } from "zustand"
import { persist } from "zustand/middleware"
import createSelectors from "@/lib/zustand-selectors"

type Theme = "light" | "dark" | "system"

type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark"
  }
  return "light"
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  const resolved = theme === "system" ? getSystemTheme() : theme

  // Add transition class for smooth switching
  root.classList.add("theme-transition")

  if (resolved === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }

  // Remove transition class after animation completes
  setTimeout(() => {
    root.classList.remove("theme-transition")
  }, 350)
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme: Theme) => {
        applyTheme(theme)
        set({ theme })
      },
    }),
    {
      name: "theme_store",
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            applyTheme(state.theme)
          }
        }
      },
    },
  ),
)

// Listen for system theme changes when theme is "system"
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const currentTheme = useThemeStore.getState().theme
    if (currentTheme === "system") {
      applyTheme("system")
    }
  })
}

export default createSelectors(useThemeStore)
