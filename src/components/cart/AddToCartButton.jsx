"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

export default function AddToCartButton({
  productId,
  className = "",
  label = "Add to cart",
  addedLabel = "Added",
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();
    addItem(productId, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-full bg-mint px-4 py-2 font-body text-sm font-bold text-white transition hover:bg-mint-dark ${className}`}
    >
      {added ? addedLabel : label}
    </button>
  );
}
