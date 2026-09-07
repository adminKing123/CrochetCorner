import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { getFirebaseErrorMessage, shouldIgnoreFirebaseError } from "@/lib/auth/errors";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function handleGoogleSignIn({ onError }) {
  try {
    await signInWithGoogle();
    return { success: true };
  } catch (error) {
    if (!shouldIgnoreFirebaseError(error.code)) {
      onError?.(getFirebaseErrorMessage(error.code));
    }

    return { success: false };
  }
}
