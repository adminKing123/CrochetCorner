import { jsonError, normalizeEmail } from "@/lib/api/response";

export function requireUserEmail(email) {
  const normalized = normalizeEmail(email);

  if (!normalized || !normalized.includes("@")) {
    return { ok: false, response: jsonError("Authentication required.", 401) };
  }

  return { ok: true, email: normalized };
}
