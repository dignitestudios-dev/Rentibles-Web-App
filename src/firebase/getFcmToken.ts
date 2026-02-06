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
      vapidKey:
        "BNnLSgZYDG5ojySEHllcFMk-BfdHRgBin9Qi3yISF820n0Cfgne6iazbjOCO5upjepmFwFi7zdvT1BUSG2wxDIw",
    });

    return token;
  } catch (error: unknown) {
    console.error("Error getting FCM token:", error);
  }
};

export default getFCMToken;
