import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/shared/Footer";
import MyShopOrdersPage from "@/components/shop-orders/MyShopOrdersPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("My Orders", {
  description: "View your Crochet Corner shop orders.",
  path: "/orders",
});

export default function MyOrdersRoutePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="font-body text-charcoal/70">Loading orders...</p>
            </div>
          }
        >
          <MyShopOrdersPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
