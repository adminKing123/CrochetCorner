import { CART_MAX_QUANTITY, CART_STORAGE_KEY } from "@/lib/shop-orders/defaults";

export function createEmptyCartState() {
  return { items: [] };
}

export function normalizeCartItem(item = {}) {
  const productId = typeof item.productId === "string" ? item.productId.trim() : "";
  const quantity = Math.min(
    CART_MAX_QUANTITY,
    Math.max(1, Number.parseInt(item.quantity, 10) || 1)
  );

  return { productId, quantity };
}

export function normalizeCartState(state = {}) {
  const items = Array.isArray(state.items)
    ? state.items.map(normalizeCartItem).filter((item) => item.productId)
    : [];

  const uniqueItems = [];

  items.forEach((item) => {
    const existing = uniqueItems.find((entry) => entry.productId === item.productId);
    if (existing) {
      existing.quantity = Math.min(CART_MAX_QUANTITY, existing.quantity + item.quantity);
      return;
    }

    uniqueItems.push(item);
  });

  return { items: uniqueItems };
}

export function readCartFromStorage() {
  if (typeof window === "undefined") {
    return createEmptyCartState();
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return createEmptyCartState();
    }

    return normalizeCartState(JSON.parse(raw));
  } catch {
    return createEmptyCartState();
  }
}

export function writeCartToStorage(state) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(normalizeCartState(state)));
}

export function clearCartStorage() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function getCartItemCount(state) {
  return normalizeCartState(state).items.reduce((total, item) => total + item.quantity, 0);
}
