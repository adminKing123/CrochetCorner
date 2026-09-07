import { NextResponse } from "next/server";
import { jsonError, jsonSuccess, normalizeEmail, parseJsonBody } from "@/lib/api/response";
import { isValidOtpType } from "@/lib/auth/validation";
import { sendOtpEmail } from "@/lib/email";
import { createOtp } from "@/lib/otp-store";

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);

    if (!body) {
      return jsonError("Invalid request body.", 400);
    }

    const { email, type } = body;

    if (!email || !type) {
      return jsonError("Email and type are required.", 400);
    }

    if (!isValidOtpType(type)) {
      return jsonError("Invalid OTP type.", 400);
    }

    const normalizedEmail = normalizeEmail(email);
    const code = createOtp(normalizedEmail, type);

    await sendOtpEmail({
      to: normalizedEmail,
      code,
      purpose: type === "password_reset" ? "password_reset" : "email_verification",
    });

    return jsonSuccess({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("send-otp error:", error);
    return jsonError("Failed to send verification code. Check SMTP settings.", 500);
  }
}
