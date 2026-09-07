import { jsonError, jsonSuccess, normalizeEmail, parseJsonBody } from "@/lib/api/response";
import { getAdminAuth } from "@/lib/firebase/admin";
import { isValidOtpType } from "@/lib/auth/validation";
import {
  createResetToken,
  markEmailVerified,
  verifyOtp,
} from "@/lib/otp-store";
import { otpTypes } from "@/config/site";

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);

    if (!body) {
      return jsonError("Invalid request body.", 400);
    }

    const { email, code, type } = body;

    if (!email || !code || !type) {
      return jsonError("Email, code, and type are required.", 400);
    }

    if (!isValidOtpType(type)) {
      return jsonError("Invalid OTP type.", 400);
    }

    const normalizedEmail = normalizeEmail(email);
    const result = verifyOtp(normalizedEmail, type, code);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    if (type === otpTypes.emailVerification) {
      markEmailVerified(normalizedEmail);

      const adminAuth = getAdminAuth();
      if (adminAuth) {
        try {
          const user = await adminAuth.getUserByEmail(normalizedEmail);
          await adminAuth.updateUser(user.uid, { emailVerified: true });
        } catch {
          // User may not exist yet during signup; local verification still applies.
        }
      }

      return jsonSuccess({
        success: true,
        message: "Email verified successfully.",
      });
    }

    const resetToken = createResetToken(normalizedEmail);

    return jsonSuccess({
      success: true,
      message: "Code verified. You can set a new password.",
      resetToken,
    });
  } catch (error) {
    console.error("verify-otp error:", error);
    return jsonError("Failed to verify code.", 500);
  }
}
