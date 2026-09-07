"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { authRoutes, authCopy } from "@/config/site";
import { auth } from "@/lib/firebase/client";
import { sendOtp } from "@/lib/auth/client-api";
import { getFirebaseErrorMessage } from "@/lib/auth/errors";
import { validatePassword } from "@/lib/auth/validation";
import { buildAuthRedirectUrl, getRedirectFromSearchParams } from "@/lib/auth/redirect";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthFormHeader from "@/components/auth/AuthFormHeader";
import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import {
  AuthButton,
  AuthError,
  AuthInput,
  AuthLink,
} from "@/components/auth/ui";

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = authCopy.signup;
  const redirectTo = getRedirectFromSearchParams(searchParams) || authRoutes.home;
  const loginHref = buildAuthRedirectUrl(authRoutes.login, redirectTo);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    setError("");

    const passwordError = validatePassword(password, confirmPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      await sendOtp(email.trim(), "email_verification");

      router.push(
        `${authRoutes.verifyEmail}?email=${encodeURIComponent(email.trim())}`
      );
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitLayout
      footer={
        <>
          {copy.footerText}{" "}
          <AuthLink href={loginHref}>{copy.footerLink}</AuthLink>
        </>
      }
    >
      <AuthFormHeader title={copy.title} subtitle={copy.subtitle} />

      <div className="space-y-5">
        <AuthError message={error} />

        <GoogleSignInButton
          onError={setError}
          disabled={loading}
          redirectTo={redirectTo}
        />

        <AuthDivider />

        <form onSubmit={handleSignup} className="space-y-4">
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

          <AuthInput
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
          />

          <AuthInput
            label="Confirm password"
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="One more time!"
            required
            autoComplete="new-password"
          />

          <AuthButton type="submit" disabled={loading}>
            {loading ? copy.loadingLabel : copy.submitLabel}
          </AuthButton>
        </form>
      </div>
    </AuthSplitLayout>
  );
}

export default function SignupForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <p className="font-body text-charcoal/70">Loading...</p>
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}
