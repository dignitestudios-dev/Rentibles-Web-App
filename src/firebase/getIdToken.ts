import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export const firebaseSignup = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;
    const idToken = await user.getIdToken();

    return { user, idToken };
  } catch (error: any) {
    throw error;
  }
};

export async function firebaseLogin(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    const idToken = await user.getIdToken();
    return { user, idToken };
  } catch (error: any) {
    throw new Error(error?.message || "Firebase login failed");
  }
}
