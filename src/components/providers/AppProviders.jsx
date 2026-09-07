"use client";

import { CartProvider } from "@/components/cart/CartProvider";

export default function AppProviders({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
