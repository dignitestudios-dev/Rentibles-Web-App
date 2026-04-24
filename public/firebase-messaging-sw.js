importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyD7uMP3e_Jxw3xSUdOPFcFC8kHB49ThAy4",
  authDomain: "rentibles-app.firebaseapp.com",
  projectId: "rentibles-app",
  storageBucket: "rentibles-app.firebasestorage.app",
  messagingSenderId: "366992554576",
  appId: "1:366992554576:web:070673a15453be3e1eef55",
  measurementId: "G-HL3045S1RH",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  self.registration.showNotification(
    payload.notification?.title || "Notification",
    {
      body: payload.notification?.body || "",
      icon: "/firebase-logo.png",
    },
  );
});
