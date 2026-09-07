import { isAdminEmail } from "@/lib/auth/admin";
import { jsonError } from "@/lib/api/response";

export function requireAdminEmail(email) {
  if (!isAdminEmail(email)) {
    return { ok: false, response: jsonError("Unauthorized.", 403) };
  }

  return { ok: true };
}
