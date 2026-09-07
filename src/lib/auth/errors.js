const ERROR_MESSAGES = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/user-not-found": "Invalid email or password.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/popup-closed-by-user": null,
};

export function getFirebaseErrorMessage(code, fallback = "Something went wrong. Please try again.") {
  if (code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[code] ?? fallback;
  }

  return fallback;
}

export function shouldIgnoreFirebaseError(code) {
  return code === "auth/popup-closed-by-user";
}
