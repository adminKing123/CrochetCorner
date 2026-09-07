import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/shared/Footer";
import CustomOrdersPage from "@/components/custom-orders/CustomOrdersPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Custom Orders", {
  description: "Request a custom crochet piece from Crochet Corner.",
  path: "/custom-orders",
});

export default function CustomOrdersRoutePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="font-body text-charcoal/70">Loading custom orders...</p>
            </div>
          }
        >
          <CustomOrdersPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
