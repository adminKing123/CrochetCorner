"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
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

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(event) {
    event.preventDefault();
    setError("");

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
      await createUserWithEmailAndPassword(auth, email.trim(), password);

      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          type: "email_verification",
        }),
      });

      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignup() {
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
      title="Create account"
      subtitle="Join Crochet Corner today"
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSignup} className="space-y-4">
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
          placeholder="Repeat your password"
          required
          autoComplete="new-password"
        />

        <AuthButton type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </AuthButton>

        <div className="relative py-2 text-center text-xs uppercase tracking-wide text-charcoal/50">
          <span className="bg-cream/90 px-2 relative z-10">or</span>
          <span className="absolute inset-x-0 top-1/2 border-t border-peach/20" />
        </div>

        <AuthButton
          type="button"
          variant="google"
          onClick={handleGoogleSignup}
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
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    default:
      return "Something went wrong. Please try again.";
  }
}
