import { normalizeEmail } from "@/lib/api/response";
import {
  SHOP_ORDER_STATUSES,
} from "@/lib/shop-orders/defaults";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeShopOrderItem(item = {}) {
  return {
    productId: normalizeText(item.productId),
    title: normalizeText(item.title),
    quantity: Math.max(1, Number.parseInt(item.quantity, 10) || 1),
    unitPrice: Number(item.unitPrice) || 0,
    lineTotal: Number(item.lineTotal) || 0,
    imageSquare: normalizeText(item.imageSquare),
  };
}

export function normalizeShopOrder(order = {}) {
  const items = Array.isArray(order.items)
    ? order.items.map(normalizeShopOrderItem).filter((item) => item.productId)
    : [];

  return {
    id: normalizeText(order.id),
    userEmail: normalizeEmail(order.userEmail || ""),
    userName: normalizeText(order.userName),
    mobile: normalizeText(order.mobile),
    deliveryNotes: normalizeText(order.deliveryNotes),
    items,
    subtotal: Number(order.subtotal) || 0,
    status: SHOP_ORDER_STATUSES.includes(order.status) ? order.status : "pending",
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
  };
}

export function sanitizeShopOrders(orders = []) {
  return orders.map((order) => normalizeShopOrder(order));
}

export function createEmptyCheckoutInput() {
  return {
    mobile: "",
    deliveryNotes: "",
  };
}

export function validateCheckoutInput(input = {}) {
  const normalized = {
    mobile: normalizeText(input.mobile),
    deliveryNotes: normalizeText(input.deliveryNotes),
  };

  if (normalized.mobile && !/^[\d\s+\-()]{7,20}$/.test(normalized.mobile)) {
    return { error: "Please enter a valid mobile number.", normalized };
  }

  if (normalized.deliveryNotes.length > 1000) {
    return { error: "Delivery notes must be 1000 characters or fewer.", normalized };
  }

  return { error: null, normalized };
}

export function validateShopOrderCreate(input = {}) {
  const userEmail = normalizeEmail(input.userEmail || "");

  if (!userEmail) {
    return "A signed-in email address is required.";
  }

  if (!Array.isArray(input.items) || !input.items.length) {
    return "Your cart is empty.";
  }

  const { error } = validateCheckoutInput(input);
  return error;
}

export function validateShopOrderStatus(status) {
  if (!SHOP_ORDER_STATUSES.includes(status)) {
    return "Invalid order status.";
  }

  return null;
}
