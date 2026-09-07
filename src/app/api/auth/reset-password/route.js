import { NextResponse } from "next/server";
import { getAdminAuth, isAdminConfigured } from "@/lib/firebase/admin";
import { consumeResetToken } from "@/lib/otp-store";

export async function POST(request) {
  try {
    const { resetToken, password } = await request.json();

    if (!resetToken || !password) {
      return NextResponse.json(
        { error: "Reset token and new password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const tokenResult = consumeResetToken(resetToken);

    if (!tokenResult.success) {
      return NextResponse.json({ error: tokenResult.error }, { status: 400 });
    }

    if (!isAdminConfigured()) {
      return NextResponse.json(
        {
          error:
            "Password reset requires FIREBASE_SERVICE_ACCOUNT in .env. Download a service account key from Firebase Console → Project Settings → Service Accounts.",
        },
        { status: 503 }
      );
    }

    const adminAuth = getAdminAuth();
    const user = await adminAuth.getUserByEmail(tokenResult.email);
    await adminAuth.updateUser(user.uid, { password });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("reset-password error:", error);

    if (error.code === "auth/user-not-found") {
      return NextResponse.json(
        { error: "No account found with this email." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to reset password." },
      { status: 500 }
    );
  }
}
