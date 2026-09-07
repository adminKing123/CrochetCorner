"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import AuthCard, { AuthButton, AuthLink } from "@/components/auth/AuthCard";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, [router]);

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="auth-bg flex min-h-screen items-center justify-center">
        <p className="text-charcoal/70">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="auth-bg flex min-h-screen items-center justify-center px-4">
      <AuthCard
        title="Hello, crocheter!"
        subtitle={`Signed in as ${user.email}`}
      >
        <div className="space-y-4 text-center">
          <p className="text-charcoal/70">
            You&apos;re all set. Your account is ready to use.
          </p>
          <AuthButton type="button" onClick={handleSignOut}>
            Sign out
          </AuthButton>
          <div className="text-sm">
            <AuthLink href="/login">Back to sign in</AuthLink>
          </div>
        </div>
      </AuthCard>
    </div>
  );
}
