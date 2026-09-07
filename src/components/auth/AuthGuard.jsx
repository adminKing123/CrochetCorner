"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authRoutes } from "@/config/site";
import { useAuthUser } from "@/hooks/useAuthUser";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { user, loading } = useAuthUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(authRoutes.login);
    }
  }, [loading, router, user]);

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
