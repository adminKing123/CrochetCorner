"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { authRoutes } from "@/config/site";
import { auth } from "@/lib/firebase/client";
import ProfileDropdown from "@/components/landing/ProfileDropdown";

export default function NavbarAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="h-9 w-9 animate-pulse rounded-full bg-peach/20" />;
  }

  if (user) {
    return <ProfileDropdown user={user} />;
  }

  return (
    <Link
      href={authRoutes.login}
      className="font-body text-sm font-semibold text-charcoal/80 transition-colors hover:text-mint"
    >
      Sign in
    </Link>
  );
}
