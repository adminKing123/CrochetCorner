"use client";

import { IoEyeOutline } from "react-icons/io5";
import { useProductQuickView } from "@/components/products/ProductQuickViewProvider";

export default function ProductQuickViewButton({ productId, className = "" }) {
  const quickView = useProductQuickView();

  if (!quickView) return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        quickView.openQuickView(productId);
      }}
      className={`absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-body text-xs font-bold text-mint shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-mint-dark ${className}`}
    >
      <IoEyeOutline className="h-4 w-4" aria-hidden="true" />
      Quick view
    </button>
  );
}
