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
      resolve(payload);
    });
  });
};
