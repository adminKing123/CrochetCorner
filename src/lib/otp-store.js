import crypto from "crypto";
import fs from "fs";
import path from "path";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const STORE_PATH = path.join(process.cwd(), "data", "auth-store.json");

const memoryStore = {
  otps: {},
  verifiedEmails: {},
  resetTokens: {},
};

function loadStore() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      memoryStore.otps = data.otps || {};
      memoryStore.verifiedEmails = data.verifiedEmails || {};
      memoryStore.resetTokens = data.resetTokens || {};
    }
  } catch {
    // Start fresh if store is corrupted.
  }
}

function saveStore() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2));
}

loadStore();

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export function createOtp(email, type) {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `${normalizedEmail}:${type}`;
  const code = generateOtp();

  memoryStore.otps[key] = {
    code,
    attempts: 0,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  };
  saveStore();

  return code;
}

export function verifyOtp(email, type, code) {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `${normalizedEmail}:${type}`;
  const record = memoryStore.otps[key];

  if (!record) {
    return { success: false, error: "No verification code found. Request a new one." };
  }

  if (Date.now() > record.expiresAt) {
    delete memoryStore.otps[key];
    saveStore();
    return { success: false, error: "Verification code has expired. Request a new one." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    delete memoryStore.otps[key];
    saveStore();
    return { success: false, error: "Too many attempts. Request a new code." };
  }

  record.attempts += 1;
  saveStore();

  if (record.code !== code.trim()) {
    return { success: false, error: "Invalid verification code." };
  }

  delete memoryStore.otps[key];
  saveStore();
  return { success: true };
}

export function markEmailVerified(email) {
  const normalizedEmail = email.toLowerCase().trim();
  memoryStore.verifiedEmails[normalizedEmail] = true;
  saveStore();
}

export function isEmailVerifiedLocally(email) {
  const normalizedEmail = email.toLowerCase().trim();
  return Boolean(memoryStore.verifiedEmails[normalizedEmail]);
}

export function createResetToken(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const token = crypto.randomBytes(32).toString("hex");

  memoryStore.resetTokens[token] = {
    email: normalizedEmail,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  };
  saveStore();

  return token;
}

export function consumeResetToken(token) {
  const record = memoryStore.resetTokens[token];

  if (!record) {
    return { success: false, error: "Invalid or expired reset session." };
  }

  if (Date.now() > record.expiresAt) {
    delete memoryStore.resetTokens[token];
    saveStore();
    return { success: false, error: "Reset session has expired. Start again." };
  }

  delete memoryStore.resetTokens[token];
  saveStore();
  return { success: true, email: record.email };
}
