"use client";

import { useState } from "react";
import { sendOtp } from "@/lib/auth/client-api";

export default function ResendOtpLink({ email, type, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    setLoading(true);
    onError?.("");
    onSuccess?.("");

    try {
      await sendOtp(email, type);
      onSuccess?.("A new code has been sent.");
    } catch (error) {
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <p className="text-center text-sm text-charcoal/70">
      Didn&apos;t receive a code?{" "}
      <button
        type="button"
        onClick={handleResend}
        disabled={loading}
        className="font-medium text-mint hover:text-mint-dark disabled:opacity-60"
      >
        {loading ? "Sending..." : "Resend code"}
      </button>
    </p>
  );
}
