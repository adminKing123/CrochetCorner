import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/email";
import { createOtp } from "@/lib/otp-store";

const VALID_TYPES = ["email_verification", "password_reset"];

export async function POST(request) {
  try {
    const { email, type } = await request.json();

    if (!email || !type) {
      return NextResponse.json(
        { error: "Email and type are required." },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: "Invalid OTP type." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const code = createOtp(normalizedEmail, type);

    await sendOtpEmail({
      to: normalizedEmail,
      code,
      purpose: type === "password_reset" ? "password_reset" : "email_verification",
    });

    return NextResponse.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json(
      { error: "Failed to send verification code. Check SMTP settings." },
      { status: 500 }
    );
  }
}
