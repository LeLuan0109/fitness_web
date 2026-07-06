import { QueryClientProvider } from "@tanstack/react-query"
import { HelmetProvider } from "@vuer-ai/react-helmet-async"
import { NuqsAdapter } from "nuqs/adapters/react"
import { Toaster } from "sonner"
import AppProvider from "./components/shared/common/app-provider"
import { CoreformDoorTransition } from "./components/shared/coreform"
import { queryClient } from "./lib/react-query"
import AppRouter from "./router"

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <HelmetProvider>
          <AppProvider>
            <AppRouter />
            <CoreformDoorTransition />
          </AppProvider>
        </HelmetProvider>
      </NuqsAdapter>
      <Toaster position="top-center" theme="light" richColors />
    </QueryClientProvider>
  )
}

export default App
