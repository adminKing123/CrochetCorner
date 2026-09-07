"use client";

import { useEffect, useState } from "react";
import CollectionItemsPreview from "@/components/admin/collections/CollectionItemsPreview";
import Spinner from "@/components/shared/Spinner";
import { fetchPublicProductsByIds } from "@/lib/products/client-api";

export default function CustomOrderProductReferences({ productIds = [], className = "" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(Boolean(productIds.length));

  useEffect(() => {
    if (!productIds.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchPublicProductsByIds(productIds)
      .then((items) => {
        if (!cancelled) {
          const productMap = new Map(items.map((product) => [product.id, product]));
          setProducts(
            productIds.map(
              (id) =>
                productMap.get(id) || {
                  id,
                  title: "Product unavailable",
                  imageSquare: "",
                  sellingPrice: 0,
                }
            )
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  if (!productIds.length) {
    return null;
  }

  return (
    <div className={className}>
      <p className="mb-3 font-body text-sm font-semibold text-charcoal/70">Referenced products</p>

      {loading ? (
        <div className="flex items-center gap-2 rounded-2xl border border-peach/15 bg-white px-4 py-6">
          <Spinner className="h-4 w-4 text-mint" label="Loading products" />
          <p className="font-body text-sm text-charcoal/60">Loading product references...</p>
        </div>
      ) : (
        <CollectionItemsPreview products={products} />
      )}
    </div>
  );
}
