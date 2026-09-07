"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import ProductDetailView from "@/components/products/ProductDetailView";
import { fetchProduct } from "@/lib/products/client-api";

export default function ProductQuickViewModal({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const open = Boolean(productId);

  useEffect(() => {
    if (!open) {
      setProduct(null);
      setError("");
      return undefined;
    }

    setLoading(true);
    setError("");

    fetchProduct(productId)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [open, productId]);

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close quick view"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-quick-view-title"
        className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-peach/20 bg-cream shadow-2xl sm:max-w-4xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-peach/15 bg-cream/95 px-5 py-4 backdrop-blur-sm">
          <p
            id="product-quick-view-title"
            className="font-body text-sm font-semibold uppercase tracking-wide text-mint"
          >
            Quick view
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-charcoal/70 transition hover:bg-peach/10 hover:text-charcoal"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <div className="p-5 md:p-8">
          {loading ? (
            <div className="space-y-4">
              <div className="aspect-[2/3] animate-pulse rounded-2xl bg-peach/10 md:max-w-sm" />
              <div className="h-8 w-2/3 animate-pulse rounded-full bg-peach/10" />
              <div className="h-6 w-1/3 animate-pulse rounded-full bg-peach/10" />
            </div>
          ) : error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
              {error}
            </p>
          ) : product ? (
            <ProductDetailView product={product} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
