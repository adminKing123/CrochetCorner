"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { authRoutes, authCopy } from "@/config/site";
import { auth } from "@/lib/firebase/client";
import { checkEmailVerified, sendOtp } from "@/lib/auth/client-api";
import { getFirebaseErrorMessage } from "@/lib/auth/errors";
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

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const copy = authCopy.login;
  const redirectTo = getRedirectFromSearchParams(searchParams) || authRoutes.home;
  const signupHref = buildAuthRedirectUrl(authRoutes.signup, redirectTo);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = credential.user;

      const verified =
        user.emailVerified || (await checkEmailVerified(user.email));

      if (!verified) {
        await sendOtp(user.email, "email_verification");
        router.push(
          `${authRoutes.verifyEmail}?email=${encodeURIComponent(user.email)}`
        );
        return;
      }

      router.push(redirectTo);
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
          <AuthLink href={signupHref}>{copy.footerLink}</AuthLink>
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

        <form onSubmit={handleEmailLogin} className="space-y-4">
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
            placeholder="Your secret stitch"
            required
            autoComplete="current-password"
          />

          <div className="text-right">
            <AuthLink href={authRoutes.forgotPassword}>Forgot password?</AuthLink>
          </div>

          <AuthButton type="submit" disabled={loading}>
            {loading ? copy.loadingLabel : copy.submitLabel}
          </AuthButton>
        </form>
      </div>
    </AuthSplitLayout>
  );
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <p className="font-body text-charcoal/70">Loading...</p>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
