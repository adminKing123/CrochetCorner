"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import AuthCard, {
  AuthButton,
  AuthError,
  AuthInput,
  AuthLink,
  GoogleIcon,
} from "@/components/auth/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function checkEmailVerified(userEmail) {
    const response = await fetch("/api/auth/check-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    });
    const data = await response.json();
    return data.verified;
  }

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
        await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            type: "email_verification",
          }),
        });
        router.push(`/verify-email?email=${encodeURIComponent(user.email)}`);
        return;
      }

      router.push("/");
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(getFirebaseErrorMessage(err.code));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to Crochet Corner"
      footer={
        <>
          Don&apos;t have an account? <AuthLink href="/signup">Sign up</AuthLink>
        </>
      }
    >
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <AuthError message={error} />

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
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />

        <div className="text-right">
          <AuthLink href="/forgot-password">Forgot password?</AuthLink>
        </div>

        <AuthButton type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </AuthButton>

        <div className="relative py-2 text-center text-xs uppercase tracking-wide text-charcoal/50">
          <span className="bg-cream/90 px-2 relative z-10">or</span>
          <span className="absolute inset-x-0 top-1/2 border-t border-peach/20" />
        </div>

        <AuthButton
          type="button"
          variant="google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <GoogleIcon />
          Continue with Google
        </AuthButton>
      </form>
    </AuthCard>
  );
}

function getFirebaseErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return "Something went wrong. Please try again.";
  }
}
