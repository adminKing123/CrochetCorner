import { Suspense } from "react";
import Navbar from "@/components/landing/Navbar";
import CollectionDetailPage from "@/components/collections/CollectionDetailPage";
import Footer from "@/components/shared/Footer";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }) {
  const { id } = await params;

  return createPageMetadata("Collection", {
    description: "View collection details and browse included crochet products.",
    path: `/collections/${id}`,
  });
}

export default async function CollectionDetailRoutePage({ params }) {
  const { id } = await params;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="font-body text-charcoal/70">Loading collection...</p>
            </div>
          }
        >
          <CollectionDetailPage collectionId={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
