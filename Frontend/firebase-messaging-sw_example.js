importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "DOMAIN",
  projectId: "PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "src/assets/favicon.jpg",
    data: payload.data,
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
  try {
    const channel = new BroadcastChannel("notification_broadcast_channel")
    channel.postMessage(payload.data)
    channel.close()
  } catch (error) {
    console.error("Error posting message to channel:", error)
  }
})
