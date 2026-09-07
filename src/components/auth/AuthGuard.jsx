"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authRoutes } from "@/config/site";
import { buildAuthRedirectUrl } from "@/lib/auth/redirect";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function AuthGuard({ children, redirectTo }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(buildAuthRedirectUrl(authRoutes.login, redirectTo || pathname));
    }
  }, [loading, pathname, redirectTo, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-charcoal/70">Checking access...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
}
