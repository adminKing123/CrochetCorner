"use client";

import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import CustomOrderForm from "@/components/custom-orders/CustomOrderForm";
import { authRoutes } from "@/config/site";

export default function CustomOrdersPage() {
  return (
    <AuthGuard>
      <div className="landing-hero min-h-screen px-6 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <p className="mb-2 font-body text-sm font-bold uppercase tracking-widest text-peach">
              Custom orders
            </p>
            <h1 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
              Tell us what you&apos;d like made
            </h1>
            <p className="mx-auto mt-3 max-w-2xl font-body text-base text-charcoal/70">
              Share your idea, reference a product from our shop, and we&apos;ll follow up with
              you by email.
            </p>
          </div>

          <CustomOrderForm />

          <p className="mt-6 text-center font-body text-sm text-charcoal/60">
            Need to check an existing request?{" "}
            <Link
              href={authRoutes.myCustomOrders}
              className="font-semibold text-mint transition hover:text-mint-dark"
            >
              View my requests
            </Link>
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
