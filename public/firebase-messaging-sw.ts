/// <reference lib="webworker" />

importScripts(
  "https://www.gstatic.com/firebasejs/9.1.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.1.0/firebase-messaging-compat.js",
);

const firebaseConfig = {
  apiKey: "AIzaSyD7uMP3e_Jxw3xSUdOPFcFC8kHB49ThAy4",
  authDomain: "rentibles-app.firebaseapp.com",
  projectId: "rentibles-app",
  storageBucket: "rentibles-app.firebasestorage.app",
  messagingSenderId: "366992554576",
  appId: "1:366992554576:web:070673a15453be3e1eef55",
  measurementId: "G-HL3045S1RH"
};

// @ts-ignore – firebase is available globally via importScripts
firebase.initializeApp(firebaseConfig);

// @ts-ignore
const messaging = firebase.messaging();

const sw = self as unknown as ServiceWorkerGlobalScope;
messaging.onBackgroundMessage((payload: any) => {
  const notificationTitle: string =
    payload?.notification?.title ?? "Notification";

  const notificationOptions: NotificationOptions = {
    body: payload?.notification?.body ?? "",
    icon: "/firebase-logo.png",
  };

  sw.registration.showNotification(notificationTitle, notificationOptions);
});
