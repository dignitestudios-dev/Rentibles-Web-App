import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getMessaging, type Messaging } from "firebase/messaging";

/**
 * Firebase config
 */
const firebaseConfig = {
  apiKey: "AIzaSyD7uMP3e_Jxw3xSUdOPFcFC8kHB49ThAy4",
  authDomain: "rentibles-app.firebaseapp.com",
  projectId: "rentibles-app",
  storageBucket: "rentibles-app.firebasestorage.app",
  messagingSenderId: "366992554576",
  appId: "1:366992554576:web:070673a15453be3e1eef55",
  measurementId: "G-HL3045S1RH",
};

/**
 * Initialize app (singleton)
 */
const app: FirebaseApp = initializeApp(firebaseConfig);

/**
 * Auth
 */
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");


export const db: Firestore = getFirestore(app);
export const firestore: Firestore = getFirestore(app);

export const storage: FirebaseStorage = getStorage(app);


export let messaging: Messaging | null = null;

if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export { app };
