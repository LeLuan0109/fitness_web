importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js")

const firebaseConfig = {
    apiKey: "AIzaSyC_mD1pNviCs9-69Fu_mmbTucseisOFGzQ",
    authDomain: "fitness-32407.firebaseapp.com",
    projectId: "fitness-32407",
    storageBucket: "fitness-32407.firebasestorage.app",
    messagingSenderId: "246457643724",
    appId: "1:246457643724:web:d1f5ed5584ce8203a2c869",
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
