import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import ShopPage from "@/components/shop/ShopPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Shop", {
  description: "Browse handmade crochet products by category, keys, and filters.",
  path: "/shop",
});

export default function ShopRoutePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="font-body text-charcoal/70">Loading shop...</p>
            </div>
          }
        >
          <ShopPage />
        </Suspense>
      </main>
    </div>
  );
}
