import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { getAdminAuth, isAdminConfigured } from "@/lib/firebase/admin";
import { consumeResetToken } from "@/lib/otp-store";
import { validatePasswordLength } from "@/lib/auth/validation";

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);

    if (!body) {
      return jsonError("Invalid request body.", 400);
    }

    const { resetToken, password } = body;

    if (!resetToken || !password) {
      return jsonError("Reset token and new password are required.", 400);
    }

    const passwordError = validatePasswordLength(password);
    if (passwordError) {
      return jsonError(passwordError, 400);
    }

    const tokenResult = consumeResetToken(resetToken);

    if (!tokenResult.success) {
      return jsonError(tokenResult.error, 400);
    }

    if (!isAdminConfigured()) {
      return jsonError(
        "Password reset requires FIREBASE_SERVICE_ACCOUNT in .env. Download a service account key from Firebase Console → Project Settings → Service Accounts.",
        503
      );
    }

    const adminAuth = getAdminAuth();
    const user = await adminAuth.getUserByEmail(tokenResult.email);
    await adminAuth.updateUser(user.uid, { password });

    return jsonSuccess({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("reset-password error:", error);

    if (error.code === "auth/user-not-found") {
      return jsonError("No account found with this email.", 404);
    }

    return jsonError("Failed to reset password.", 500);
  }
}
