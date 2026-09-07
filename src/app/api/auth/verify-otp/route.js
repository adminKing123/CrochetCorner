import { NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import {
  createResetToken,
  markEmailVerified,
  verifyOtp,
} from "@/lib/otp-store";

const VALID_TYPES = ["email_verification", "password_reset"];

export async function POST(request) {
  try {
    const { email, code, type } = await request.json();

    if (!email || !code || !type) {
      return NextResponse.json(
        { error: "Email, code, and type are required." },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid OTP type." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = verifyOtp(normalizedEmail, type, code);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (type === "email_verification") {
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

      return NextResponse.json({
        success: true,
        message: "Email verified successfully.",
      });
    }

    const resetToken = createResetToken(normalizedEmail);

    return NextResponse.json({
      success: true,
      message: "Code verified. You can set a new password.",
      resetToken,
    });
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { error: "Failed to verify code." },
      { status: 500 }
    );
  }
}
