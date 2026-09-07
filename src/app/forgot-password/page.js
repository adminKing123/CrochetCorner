"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authRoutes, otpTypes } from "@/config/site";
import { sendOtp } from "@/lib/auth/client-api";
import AuthCard from "@/components/auth/AuthCard";
import { AuthButton, AuthError, AuthInput, AuthLink, AuthSuccess } from "@/components/auth/ui";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await sendOtp(email.trim(), otpTypes.passwordReset);
      setSuccess("Reset code sent! Redirecting...");
      setTimeout(() => {
        router.push(
          `${authRoutes.resetPassword}?email=${encodeURIComponent(email.trim())}`
        );
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="Enter your email and we'll send a 6-digit reset code"
      footer={
        <>
          Remember your password? <AuthLink href={authRoutes.login}>Sign in</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthError message={error} />
        <AuthSuccess message={success} />

        <AuthInput
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />

        <AuthButton type="submit" disabled={loading}>
          {loading ? "Sending code..." : "Send reset code"}
        </AuthButton>
      </form>
    </AuthCard>
  );
}
