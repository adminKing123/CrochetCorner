"use client";

import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";

export default function ProductGrid({
  products,
  loading,
  skeletonCount = 8,
  emptyMessage = "No products found.",
  imageAspectRatio = "2/3",
  className = "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6",
}) {
  if (loading) {
    return (
      <div className={className}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <ProductCardSkeleton
            key={`product-skeleton-${index}`}
            imageAspectRatio={imageAspectRatio}
          />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-3xl border border-peach/20 bg-white px-6 py-16 text-center">
        <p className="font-body text-charcoal/70">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
          imageAspectRatio={imageAspectRatio}
        />
      ))}
    </div>
  );
}
