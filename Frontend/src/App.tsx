import { QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "@vuer-ai/react-helmet-async"
import { NuqsAdapter } from "nuqs/adapters/react"
import { Toaster } from "sonner"
import AppProvider from "./components/shared/common/app-provider"
import { queryClient } from "./lib/react-query"
import AppRouter from "./router"
import themeStore from "./stores/theme.store"

function App() {
  const theme = themeStore.use.theme()

  // Resolve "system" to actual theme for Toaster
  const resolvedTheme = theme === "system"
    ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme

  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <HelmetProvider>
          <AppProvider>
            <AppRouter />
          </AppProvider>
        </HelmetProvider>
      </NuqsAdapter>
      <Toaster position="top-center" theme={resolvedTheme} richColors />
    </QueryClientProvider>
  )
}

export default App
