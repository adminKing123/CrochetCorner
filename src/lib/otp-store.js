import crypto from "crypto";
import {
  FIRESTORE_COLLECTIONS,
  deleteDocument,
  getDocument,
  sanitizeFirestoreDocId,
  setDocument,
} from "@/lib/firebase/firestore";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function otpDocId(email, type) {
  return sanitizeFirestoreDocId(`${email.toLowerCase().trim()}:${type}`);
}

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export async function createOtp(email, type) {
  const normalizedEmail = email.toLowerCase().trim();
  const id = otpDocId(normalizedEmail, type);
  const code = generateOtp();

  await setDocument(FIRESTORE_COLLECTIONS.authOtps, id, {
    code,
    attempts: 0,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    email: normalizedEmail,
    type,
  });

  return code;
}

export async function verifyOtp(email, type, code) {
  const normalizedEmail = email.toLowerCase().trim();
  const id = otpDocId(normalizedEmail, type);
  const record = await getDocument(FIRESTORE_COLLECTIONS.authOtps, id);

  if (!record) {
    return { success: false, error: "No verification code found. Request a new one." };
  }

  if (Date.now() > record.expiresAt) {
    await deleteDocument(FIRESTORE_COLLECTIONS.authOtps, id);
    return { success: false, error: "Verification code has expired. Request a new one." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    await deleteDocument(FIRESTORE_COLLECTIONS.authOtps, id);
    return { success: false, error: "Too many attempts. Request a new code." };
  }

  const attempts = record.attempts + 1;
  await setDocument(FIRESTORE_COLLECTIONS.authOtps, id, { ...record, attempts });

  if (record.code !== code.trim()) {
    return { success: false, error: "Invalid verification code." };
  }

  await deleteDocument(FIRESTORE_COLLECTIONS.authOtps, id);
  return { success: true };
}

export async function markEmailVerified(email) {
  const normalizedEmail = email.toLowerCase().trim();
  await setDocument(FIRESTORE_COLLECTIONS.authVerifiedEmails, normalizedEmail, {
    verified: true,
    verifiedAt: new Date().toISOString(),
  });
}

export async function isEmailVerifiedLocally(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const record = await getDocument(FIRESTORE_COLLECTIONS.authVerifiedEmails, normalizedEmail);
  return Boolean(record?.verified);
}

export async function createResetToken(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const token = crypto.randomBytes(32).toString("hex");

  await setDocument(FIRESTORE_COLLECTIONS.authResetTokens, token, {
    email: normalizedEmail,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });

  return token;
}

export async function consumeResetToken(token) {
  const record = await getDocument(FIRESTORE_COLLECTIONS.authResetTokens, token);

  if (!record) {
    return { success: false, error: "Invalid or expired reset session." };
  }

  if (Date.now() > record.expiresAt) {
    await deleteDocument(FIRESTORE_COLLECTIONS.authResetTokens, token);
    return { success: false, error: "Reset session has expired. Start again." };
  }

  await deleteDocument(FIRESTORE_COLLECTIONS.authResetTokens, token);
  return { success: true, email: record.email };
}
