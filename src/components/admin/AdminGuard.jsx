"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { authRoutes } from "@/config/site";
import { auth } from "@/lib/firebase/client";
import { isAdminUser } from "@/lib/auth/admin-client";

export default function AdminGuard({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(authRoutes.login);
      return;
    }

    if (!isAdminUser(user)) {
      router.replace(authRoutes.home);
    }
  }, [loading, router, user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="font-body text-charcoal/70">Checking access...</p>
      </div>
    );
  }

  if (!user || !isAdminUser(user)) {
    return null;
  }

  return children;
}
