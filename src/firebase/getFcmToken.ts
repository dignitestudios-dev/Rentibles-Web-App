import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";

/**
 * Get FCM token (browser only)
 */
const getFCMToken = async (): Promise<string | undefined> => {
  try {
    // SSR guard
    if (typeof window === "undefined") return;

    if (!messaging) {
      console.warn("Firebase messaging is not initialized");
      return;
    }

    const permission: NotificationPermission =
      await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    const token: string = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    });

    return token;
  } catch (error: unknown) {
    console.error("Error getting FCM token:", error);
  }
};

export default getFCMToken;
