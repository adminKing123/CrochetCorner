"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  clearCartStorage,
  getCartItemCount,
  normalizeCartState,
  readCartFromStorage,
  writeCartToStorage,
} from "@/lib/cart/storage";
import { CART_MAX_QUANTITY } from "@/lib/shop-orders/defaults";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCart(readCartFromStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeCartToStorage(cart);
  }, [cart, ready]);

  const addItem = useCallback((productId, quantity = 1) => {
    if (!productId) return;

    setCart((current) => {
      const next = normalizeCartState(current);
      const existing = next.items.find((item) => item.productId === productId);

      if (existing) {
        existing.quantity = Math.min(CART_MAX_QUANTITY, existing.quantity + quantity);
        return { items: [...next.items] };
      }

      return {
        items: [...next.items, { productId, quantity: Math.min(CART_MAX_QUANTITY, quantity) }],
      };
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setCart((current) => ({
      items: current.items.filter((item) => item.productId !== productId),
    }));
  }, []);

  const setQuantity = useCallback((productId, quantity) => {
    setCart((current) => {
      if (quantity <= 0) {
        return { items: current.items.filter((item) => item.productId !== productId) };
      }

      return {
        items: current.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(CART_MAX_QUANTITY, quantity) }
            : item
        ),
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({ items: [] });
    clearCartStorage();
  }, []);

  const value = useMemo(
    () => ({
      cart,
      ready,
      itemCount: getCartItemCount(cart),
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    }),
    [addItem, cart, clearCart, ready, removeItem, setQuantity]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
