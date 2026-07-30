import { onMessage, type MessagePayload } from "firebase/messaging";
import { messaging } from "./firebase";

/**
 * Listen for foreground FCM messages
 */
export const onMessageListener = (): Promise<MessagePayload> => {
  return new Promise((resolve, reject) => {
    // SSR / messaging safety
    if (!messaging) {
      reject(new Error("Firebase messaging is not initialized"));
      return;
    }

    onMessage(messaging, (payload: MessagePayload) => {
      console.log("🚀 ~ onMessageListener ~ payload:", payload);
      resolve(payload);
    });
  });
};

export const subscribeToForegroundMessages = (
  callback: (payload: MessagePayload) => void,
): (() => void) | undefined => {
  if (typeof window === "undefined" || !messaging) return undefined;
  return onMessage(messaging, (payload) => {
    console.log("🚀 FCM Foreground Message received:", payload);
    callback(payload);
  });
};
