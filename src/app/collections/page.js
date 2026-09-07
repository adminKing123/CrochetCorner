import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import CollectionsPage from "@/components/collections/CollectionsPage";
import Footer from "@/components/shared/Footer";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Collections", {
  description: "Browse curated crochet collections grouped by theme, mood, and style.",
  path: "/collections",
});

export default function CollectionsRoutePage() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="font-body text-charcoal/70">Loading collections...</p>
            </div>
          }
        >
          <CollectionsPage />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
