import { jsonError, jsonSuccess, normalizeEmail, parseJsonBody } from "@/lib/api/response";
import { isEmailVerifiedLocally } from "@/lib/otp-store";

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);

    if (!body) {
      return jsonError("Invalid request body.", 400);
    }

    const { email } = body;

    if (!email) {
      return jsonError("Email is required.", 400);
    }

    const verified = isEmailVerifiedLocally(normalizeEmail(email));

    return jsonSuccess({ verified });
  } catch (error) {
    console.error("check-verification error:", error);
    return jsonError("Failed to check verification status.", 500);
  }
}
