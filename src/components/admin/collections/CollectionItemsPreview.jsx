"use client";

import { IoClose } from "react-icons/io5";
import { formatCurrency } from "@/lib/products/format";

export default function CollectionItemsPreview({ products, onRemove }) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-dashed border-peach/25 bg-white px-4 py-8 text-center">
        <p className="font-body text-sm text-charcoal/60">
          No products added yet. Search and select products above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <article
          key={product.id}
          className="overflow-hidden rounded-2xl border border-peach/20 bg-white shadow-sm"
        >
          <div className="relative aspect-square bg-peach/5">
            {product.imageSquare ? (
              <img
                src={product.imageSquare}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : null}
            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-charcoal shadow-sm transition hover:bg-red-50 hover:text-red-600"
              aria-label={`Remove ${product.title}`}
            >
              <IoClose className="h-4 w-4" />
            </button>
          </div>
          <div className="p-3">
            <h4 className="line-clamp-2 font-body text-sm font-semibold text-charcoal">
              {product.title}
            </h4>
            <p className="mt-1 font-body text-xs text-charcoal/50">{product.id}</p>
            <p className="mt-1 font-body text-sm font-semibold text-mint">
              {formatCurrency(product.sellingPrice)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
