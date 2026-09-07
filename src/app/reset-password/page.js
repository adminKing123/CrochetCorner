"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authRoutes, otpTypes } from "@/config/site";
import { resetPassword, verifyOtp } from "@/lib/auth/client-api";
import { validatePassword } from "@/lib/auth/validation";
import AuthCard from "@/components/auth/AuthCard";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import { AuthButton, AuthError, AuthInput, AuthLink, AuthSuccess } from "@/components/auth/ui";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [step, setStep] = useState("otp");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerifyOtp(code) {
    const data = await verifyOtp(email, code, otpTypes.passwordReset);
    setResetToken(data.resetToken);
    setStep("password");
    setSuccess("Code verified. Set your new password.");
  }

  async function handleResetPassword(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const passwordError = validatePassword(password, confirmPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(resetToken, password);
      setSuccess("Password updated! Redirecting to sign in...");
      setTimeout(() => router.push(authRoutes.login), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!email) {
    return (
      <AuthCard title="Reset password" subtitle="Missing email address">
        <AuthError message="No email provided. Start from forgot password." />
        <div className="mt-4 text-center">
          <AuthLink href={authRoutes.forgotPassword}>Forgot password</AuthLink>
        </div>
      </AuthCard>
    );
  }

  if (step === "password") {
    return (
      <AuthCard
        title="Set new password"
        subtitle={`Create a new password for ${email}`}
        footer={<AuthLink href={authRoutes.login}>Back to sign in</AuthLink>}
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
        <AuthLink href={authRoutes.forgotPassword}>Use a different email</AuthLink>
      }
    >
      <OtpVerificationForm
        email={email}
        otpType={otpTypes.passwordReset}
        submitLabel="Verify code"
        onVerify={handleVerifyOtp}
      />
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
