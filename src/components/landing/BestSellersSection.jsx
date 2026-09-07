"use client";

import { useEffect, useState } from "react";
import LandingSection from "@/components/landing/LandingSection";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductQuickViewProvider } from "@/components/products/ProductQuickViewProvider";
import { BEST_SELLERS_LIMIT } from "@/lib/products/defaults";
import { fetchBestSellers } from "@/lib/products/client-api";

export default function BestSellersSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBestSellers(BEST_SELLERS_LIMIT)
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !error && products.length === 0) {
    return null;
  }

  return (
    <ProductQuickViewProvider>
      <LandingSection
        id="best-sellers"
        eyebrow="Customer favorites"
        title="Best sellers"
        description="Hand-picked crochet pieces our community loves most — cozy, colorful, and ready to ship."
        className="landing-hero"
      >
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
            Could not load best sellers. Please try again later.
          </p>
        ) : null}

        <ProductGrid
          products={products}
          loading={loading}
          skeletonCount={BEST_SELLERS_LIMIT}
          emptyMessage="No best sellers yet."
        />
      </LandingSection>
    </ProductQuickViewProvider>
  );
}
