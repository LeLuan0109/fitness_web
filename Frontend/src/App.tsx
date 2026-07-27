import { QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "@vuer-ai/react-helmet-async"
import { ThemeProvider } from "next-themes"
import { NuqsAdapter } from "nuqs/adapters/react"
import AppProvider from "./components/shared/common/app-provider"
import { CoreformDoorTransition } from "./components/shared/coreform"
import { Toaster } from "./components/shared/ui/sonner"
import { queryClient } from "./lib/react-query"
import AppRouter from "./router"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="coreform-theme">
        <NuqsAdapter>
          <HelmetProvider>
            <AppProvider>
              <AppRouter />
              <CoreformDoorTransition />
            </AppProvider>
          </HelmetProvider>
        </NuqsAdapter>
        <Toaster position="top-center" richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
