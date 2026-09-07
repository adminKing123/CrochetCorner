import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/shared/Footer";
import MyCustomOrdersPage from "@/components/custom-orders/MyCustomOrdersPage";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("My Custom Orders", {
  description: "View your custom order requests with Crochet Corner.",
  path: "/custom-orders/requests",
});

export default function MyCustomOrdersRoutePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="font-body text-charcoal/70">Loading your requests...</p>
            </div>
          }
        >
          <MyCustomOrdersPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
