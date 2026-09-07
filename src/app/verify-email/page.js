"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authRoutes, otpTypes } from "@/config/site";
import { auth } from "@/lib/firebase/client";
import { verifyOtp } from "@/lib/auth/client-api";
import AuthCard from "@/components/auth/AuthCard";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import { AuthError, AuthLink } from "@/components/auth/ui";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  async function handleVerify(code) {
    await verifyOtp(email, code, otpTypes.emailVerification);

    if (auth.currentUser) {
      await auth.currentUser.reload();
    }

    setTimeout(() => router.push(authRoutes.home), 1500);
    return "Email verified! Redirecting...";
  }

  if (!email) {
    return (
      <AuthCard title="Verify email" subtitle="Missing email address">
        <AuthError message="No email provided. Please sign up or sign in again." />
        <div className="mt-4 text-center">
          <AuthLink href={authRoutes.login}>Back to sign in</AuthLink>
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
          Wrong email? <AuthLink href={authRoutes.signup}>Sign up again</AuthLink>
        </>
      }
    >
      <OtpVerificationForm
        email={email}
        otpType={otpTypes.emailVerification}
        submitLabel="Verify email"
        onVerify={handleVerify}
      />
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
