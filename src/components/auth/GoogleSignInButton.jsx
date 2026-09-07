"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/config/site";
import { handleGoogleSignIn } from "@/lib/auth/google";
import { AuthButton, GoogleIcon } from "@/components/auth/ui";

export default function GoogleSignInButton({
  onError,
  disabled = false,
  redirectTo = authRoutes.home,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    onError?.("");
    setLoading(true);

    const result = await handleGoogleSignIn({ onError });

    if (result.success) {
      router.push(redirectTo);
    }

    setLoading(false);
  }

  return (
    <AuthButton
      type="button"
      variant="google"
      onClick={onClick}
      disabled={disabled || loading}
    >
      <GoogleIcon />
      {loading ? "Connecting..." : "Continue with Google"}
    </AuthButton>
  );
}
