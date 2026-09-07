import { validationMessages } from "@/config/site";

const JSON_HEADERS = { "Content-Type": "application/json" };

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || validationMessages.genericError);
  }

  return data;
}

export function sendOtp(email, type) {
  return postJson("/api/auth/send-otp", { email, type });
}

export function verifyOtp(email, code, type) {
  return postJson("/api/auth/verify-otp", { email, code, type });
}

export function resetPassword(resetToken, password) {
  return postJson("/api/auth/reset-password", { resetToken, password });
}

export async function checkEmailVerified(email) {
  const data = await postJson("/api/auth/check-verification", { email });
  return data.verified;
}
