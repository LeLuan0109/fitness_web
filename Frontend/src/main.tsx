import "@/styles/index.css"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { GOOGLE_CLIENT_ID } from "./constants/api"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorFallbackView } from "./components/shared/common/error-fallback"

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw.js").catch((err) => {
    console.warn("ServiceWorker registration failed:", err)
  })
}

const AppWithProviders = () => {
  const content = (
    <ErrorBoundary FallbackComponent={ErrorFallbackView}>
      <App />
    </ErrorBoundary>
  )

  // Luôn bọc GoogleOAuthProvider để nút Google không văng lỗi khi chưa cấu hình.
  // Chưa có client id thật -> dùng id placeholder (nút mount được, login Google sẽ không hoạt động).
  const clientId = GOOGLE_CLIENT_ID || "000000000000-placeholder.apps.googleusercontent.com"
  return <GoogleOAuthProvider clientId={clientId}>{content}</GoogleOAuthProvider>
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
)
