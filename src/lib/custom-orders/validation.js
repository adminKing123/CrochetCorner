import {
  CUSTOM_ORDER_DETAILS_MAX_LENGTH,
  CUSTOM_ORDER_DETAILS_MIN_LENGTH,
  CUSTOM_ORDER_STATUSES,
} from "@/lib/custom-orders/defaults";
import { normalizeEmail } from "@/lib/api/response";

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeCustomOrder(order = {}) {
  const productIds = Array.isArray(order.productIds)
    ? order.productIds.filter(Boolean)
    : order.productId
      ? [normalizeText(order.productId)]
      : [];

  const productTitles = Array.isArray(order.productTitles)
    ? order.productTitles.filter(Boolean)
    : order.productTitle
      ? [normalizeText(order.productTitle)]
      : [];

  return {
    id: normalizeText(order.id),
    userEmail: normalizeEmail(order.userEmail || ""),
    userName: normalizeText(order.userName),
    mobile: normalizeText(order.mobile),
    details: normalizeText(order.details),
    productIds,
    productTitles,
    status: CUSTOM_ORDER_STATUSES.includes(order.status) ? order.status : "pending",
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
  };
}

export function sanitizeCustomOrders(orders = []) {
  return orders.map((order) => normalizeCustomOrder(order));
}

export function createEmptyCustomOrderInput() {
  return {
    details: "",
    mobile: "",
    productIds: [],
  };
}

export function validateCustomOrderInput(input = {}) {
  const normalized = {
    details: normalizeText(input.details),
    mobile: normalizeText(input.mobile),
    productIds: Array.isArray(input.productIds)
      ? input.productIds.map((id) => normalizeText(id)).filter(Boolean)
      : [],
  };

  if (!normalized.details) {
    return { error: "Please describe what you would like to order.", normalized };
  }

  if (normalized.details.length < CUSTOM_ORDER_DETAILS_MIN_LENGTH) {
    return {
      error: `Please provide at least ${CUSTOM_ORDER_DETAILS_MIN_LENGTH} characters of detail.`,
      normalized,
    };
  }

  if (normalized.details.length > CUSTOM_ORDER_DETAILS_MAX_LENGTH) {
    return {
      error: `Details must be ${CUSTOM_ORDER_DETAILS_MAX_LENGTH} characters or fewer.`,
      normalized,
    };
  }

  if (normalized.mobile && !/^[\d\s+\-()]{7,20}$/.test(normalized.mobile)) {
    return { error: "Please enter a valid mobile number.", normalized };
  }

  return { error: null, normalized };
}

export function validateCustomOrderCreate(input = {}) {
  const userEmail = normalizeEmail(input.userEmail || "");

  if (!userEmail) {
    return "A signed-in email address is required.";
  }

  const { error } = validateCustomOrderInput(input);
  return error;
}

export function validateCustomOrderStatus(status) {
  if (!CUSTOM_ORDER_STATUSES.includes(status)) {
    return "Invalid order status.";
  }

  return null;
}
