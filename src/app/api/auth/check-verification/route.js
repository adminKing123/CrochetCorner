import { NextResponse } from "next/server";
import { isEmailVerifiedLocally } from "@/lib/otp-store";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const verified = isEmailVerifiedLocally(normalizedEmail);

    return NextResponse.json({ verified });
  } catch (error) {
    console.error("check-verification error:", error);
    return NextResponse.json(
      { error: "Failed to check verification status." },
      { status: 500 }
    );
  }
}
