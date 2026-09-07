"use client";

import Link from "next/link";
import { IoCartOutline } from "react-icons/io5";
import { authRoutes } from "@/config/site";
import { useCart } from "@/components/cart/CartProvider";

export default function CartIconButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href={authRoutes.cart}
      aria-label={`Cart${itemCount ? `, ${itemCount} items` : ""}`}
      className="relative rounded-full p-2 text-charcoal/75 transition hover:bg-peach/10 hover:text-mint"
    >
      <IoCartOutline className="h-6 w-6" aria-hidden="true" />
      {itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-peach px-1 font-body text-[10px] font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
