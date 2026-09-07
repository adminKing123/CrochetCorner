"use client";

import Link from "next/link";
import ProductImage from "@/components/products/ProductImage";
import { authRoutes } from "@/config/site";

export default function CollectionProductPreviewStrip({
  products,
  totalCount,
  previewLimit = 4,
  collectionId,
  className = "",
}) {
  const previewProducts = products.slice(0, previewLimit);
  const remainingCount = Math.max(totalCount - previewProducts.length, 0);
  const collectionHref = authRoutes.collectionDetail(collectionId);

  if (!totalCount) {
    return (
      <p className="font-body text-sm text-charcoal/60">No products in this collection yet.</p>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {previewProducts.map((product) => (
          <Link
            key={product.id}
            href={collectionHref}
            className="group block w-[72px] shrink-0 overflow-hidden rounded-2xl border border-peach/15 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-peach/30 hover:shadow-md sm:w-20"
            aria-label={`View ${product.title} in collection`}
          >
            <ProductImage
              src={product.imageSquare || product.imagePortrait}
              alt={product.title}
              aspectRatio="1/1"
              className="rounded-2xl"
              imageClassName="transition duration-300 group-hover:scale-105"
            />
          </Link>
        ))}

        {remainingCount > 0 ? (
          <Link
            href={collectionHref}
            className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-dashed border-mint/35 bg-mint/10 font-display text-lg font-bold text-mint transition hover:border-mint hover:bg-mint/15 sm:h-20 sm:w-20 sm:text-xl"
            aria-label={`View ${remainingCount} more products in collection`}
          >
            +{remainingCount}
          </Link>
        ) : null}
      </div>

      <p className="mt-3 font-body text-sm text-charcoal/65">
        {totalCount} product{totalCount === 1 ? "" : "s"} in this collection
      </p>
    </div>
  );
}
