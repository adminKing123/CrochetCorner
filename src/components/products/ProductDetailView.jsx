import { IoStar } from "react-icons/io5";
import ProductImage from "@/components/products/ProductImage";
import ProductPrice from "@/components/products/ProductPrice";

export default function ProductDetailView({ product }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
        <ProductImage
          src={product.imagePortrait}
          alt={`${product.title} portrait`}
          aspectRatio="2/3"
          className="rounded-2xl"
          priority
        />
        <ProductImage
          src={product.imageSquare}
          alt={`${product.title} square`}
          aspectRatio="1/1"
          className="rounded-2xl"
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {product.isBestSeller ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow/90 px-3 py-1 font-body text-xs font-bold text-charcoal">
              <IoStar className="h-3.5 w-3.5" aria-hidden="true" />
              Best seller
            </span>
          ) : null}
        </div>

        <h2 className="font-display text-2xl font-bold leading-tight text-charcoal md:text-3xl">
          {product.title}
        </h2>

        <ProductPrice
          originalPrice={product.originalPrice}
          sellingPrice={product.sellingPrice}
          size="lg"
        />

        <p className="font-body text-sm leading-relaxed text-charcoal/70 md:text-base">
          A handmade crochet piece from Crochet Corner — soft textures, thoughtful
          details, and cozy charm in every stitch.
        </p>
      </div>
    </div>
  );
}
