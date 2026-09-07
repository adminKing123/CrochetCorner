"use client";

import { IoStar } from "react-icons/io5";
import ProductImage from "@/components/products/ProductImage";
import ProductPrice from "@/components/products/ProductPrice";
import ProductQuickViewButton from "@/components/products/ProductQuickViewButton";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function ProductCard({
  product,
  priority = false,
  showQuickView = true,
  imageAspectRatio = "2/3",
}) {
  const imageSrc =
    imageAspectRatio === "1/1"
      ? product.imageSquare || product.imagePortrait
      : product.imagePortrait || product.imageSquare;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-peach/15 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-peach/30 hover:shadow-lg">
      <div className="relative">
        <ProductImage
          src={imageSrc}
          alt={product.title}
          aspectRatio={imageAspectRatio}
          className="rounded-t-3xl"
          imageClassName="transition duration-500 group-hover:scale-105"
          priority={priority}
        />

        {product.isBestSeller ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-yellow/90 px-2.5 py-1 font-body text-xs font-bold text-charcoal shadow-sm backdrop-blur-sm">
            <IoStar className="h-3.5 w-3.5" aria-hidden="true" />
            Best seller
          </span>
        ) : null}

        {showQuickView ? <ProductQuickViewButton productId={product.id} /> : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
        <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-charcoal transition group-hover:text-mint">
          {product.title}
        </h3>
        <ProductPrice
          originalPrice={product.originalPrice}
          sellingPrice={product.sellingPrice}
        />
        <AddToCartButton productId={product.id} className="mt-2 w-full" />
      </div>
    </article>
  );
}
