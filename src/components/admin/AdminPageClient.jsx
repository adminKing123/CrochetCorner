"use client";

import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import Navbar from "@/components/landing/Navbar";
import { authRoutes, siteConfig } from "@/config/site";

export default function AdminPageClient() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-cream">
        <Navbar />

        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="rounded-3xl border border-peach/20 bg-white p-8 shadow-sm">
            <p className="font-body text-sm font-semibold uppercase tracking-wide text-mint">
              Admin
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-charcoal">
              Admin Panel
            </h1>
            <p className="mt-3 max-w-2xl font-body text-charcoal/70">
              Welcome to the {siteConfig.name} admin area. More tools will be added here soon.
            </p>

            <Link
              href={authRoutes.home}
              className="mt-8 inline-block font-body text-sm font-semibold text-mint transition hover:text-mint-dark"
            >
              ← Back to site
            </Link>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
