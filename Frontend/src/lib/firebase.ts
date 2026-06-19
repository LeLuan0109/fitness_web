import { initializeApp } from "firebase/app"
import { getMessaging, getToken, type Messaging } from "firebase/messaging"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
}

// Khởi tạo Firebase Messaging an toàn: nếu chưa cấu hình (hoặc lỗi) thì
// KHÔNG để văng lỗi làm trắng cả app — chỉ tắt tính năng push notification.
export let messaging: Messaging | null = null
try {
  if (firebaseConfig.projectId && firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig)
    messaging = getMessaging(app)
  } else {
    console.warn("[firebase] Thiếu cấu hình - push notification bị tắt.")
  }
} catch (error) {
  console.warn("[firebase] Khởi tạo messaging thất bại - push notification bị tắt:", error)
}

export const requestNotificationPermission = async () => {
  try {
    if (!messaging) return null
    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_REACT_APP_FIREBASE_VAPID_KEY,
      })
      return token
    }

    return null
  } catch (error) {
    console.error("Error getting notification permission:", error)
    return null
  }
}
