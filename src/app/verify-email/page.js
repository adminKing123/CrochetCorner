"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import AuthCard, {
  AuthButton,
  AuthError,
  AuthLink,
  AuthSuccess,
} from "@/components/auth/AuthCard";
import OtpInput from "@/components/auth/OtpInput";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: otp,
          type: "email_verification",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed.");
        return;
      }

      setSuccess("Email verified! Redirecting...");
      if (auth.currentUser) {
        await auth.currentUser.reload();
      }
      setTimeout(() => router.push("/"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          type: "email_verification",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend code.");
        return;
      }

      setSuccess("A new code has been sent to your email.");
      setOtp("");
    } catch {
      setError("Failed to resend code.");
    } finally {
      setResending(false);
    }
  }

  if (!email) {
    return (
      <AuthCard title="Verify email" subtitle="Missing email address">
        <AuthError message="No email provided. Please sign up or sign in again." />
        <div className="mt-4 text-center">
          <AuthLink href="/login">Back to sign in</AuthLink>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${email}`}
      footer={
        <>
          Wrong email? <AuthLink href="/signup">Sign up again</AuthLink>
        </>
      }
    >
      <form onSubmit={handleVerify} className="space-y-6">
        <AuthError message={error} />
        <AuthSuccess message={success} />

        <OtpInput value={otp} onChange={setOtp} disabled={loading} />

        <AuthButton type="submit" disabled={loading || otp.length !== 6}>
          {loading ? "Verifying..." : "Verify email"}
        </AuthButton>

        <p className="text-center text-sm text-charcoal/70">
          Didn&apos;t receive a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-mint hover:text-mint-dark disabled:opacity-60"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </p>
      </form>
    </AuthCard>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthCard title="Verify your email" subtitle="Loading...">
          <div className="py-8 text-center text-charcoal/60">Loading...</div>
        </AuthCard>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
