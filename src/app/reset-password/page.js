"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthCard, {
  AuthButton,
  AuthError,
  AuthInput,
  AuthLink,
  AuthSuccess,
} from "@/components/auth/AuthCard";
import OtpInput from "@/components/auth/OtpInput";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [step, setStep] = useState("otp");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerifyOtp(event) {
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
          type: "password_reset",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid code.");
        return;
      }

      setResetToken(data.resetToken);
      setStep("password");
      setSuccess("Code verified. Set your new password.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password.");
        return;
      }

      setSuccess("Password updated! Redirecting to sign in...");
      setTimeout(() => router.push("/login"), 1500);
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
          type: "password_reset",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend code.");
        return;
      }

      setSuccess("A new code has been sent.");
      setOtp("");
    } catch {
      setError("Failed to resend code.");
    } finally {
      setResending(false);
    }
  }

  if (!email) {
    return (
      <AuthCard title="Reset password" subtitle="Missing email address">
        <AuthError message="No email provided. Start from forgot password." />
        <div className="mt-4 text-center">
          <AuthLink href="/forgot-password">Forgot password</AuthLink>
        </div>
      </AuthCard>
    );
  }

  if (step === "password") {
    return (
      <AuthCard
        title="Set new password"
        subtitle={`Create a new password for ${email}`}
        footer={
          <>
            <AuthLink href="/login">Back to sign in</AuthLink>
          </>
        }
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <AuthError message={error} />
          <AuthSuccess message={success} />

          <AuthInput
            label="New password"
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
          />

          <AuthInput
            label="Confirm new password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Repeat your password"
            required
            autoComplete="new-password"
          />

          <AuthButton type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </AuthButton>
        </form>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset password"
      subtitle={`Enter the 6-digit code sent to ${email}`}
      footer={
        <>
          <AuthLink href="/forgot-password">Use a different email</AuthLink>
        </>
      }
    >
      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <AuthError message={error} />
        <AuthSuccess message={success} />

        <OtpInput value={otp} onChange={setOtp} disabled={loading} />

        <AuthButton type="submit" disabled={loading || otp.length !== 6}>
          {loading ? "Verifying..." : "Verify code"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthCard title="Reset password" subtitle="Loading...">
          <div className="py-8 text-center text-charcoal/60">Loading...</div>
        </AuthCard>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
