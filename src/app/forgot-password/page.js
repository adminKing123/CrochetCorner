"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard, {
  AuthButton,
  AuthError,
  AuthInput,
  AuthLink,
  AuthSuccess,
} from "@/components/auth/AuthCard";

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
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: "password_reset",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send reset code.");
        return;
      }

      setSuccess("Reset code sent! Redirecting...");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
      }, 1200);
    } catch {
      setError("Something went wrong. Please try again.");
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
          Remember your password? <AuthLink href="/login">Sign in</AuthLink>
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
