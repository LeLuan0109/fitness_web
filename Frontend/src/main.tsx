import "@/styles/index.css"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { GOOGLE_CLIENT_ID } from "./constants/api"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "./components/shared/common/error-fallback"

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js").catch((err) => {
    console.warn("ServiceWorker registration failed:", err)
  })
}

const AppWithProviders = () => {
  const content = (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </ErrorBoundary>
  )

  if (GOOGLE_CLIENT_ID) {
    return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{content}</GoogleOAuthProvider>
  }

  return content
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
)
