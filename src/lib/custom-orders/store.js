import fs from "fs";
import path from "path";
import { generateId } from "@/lib/generate-id";
import { normalizeEmail } from "@/lib/api/response";
import {
  CUSTOM_ORDERS_ADMIN_PAGE_SIZE,
  CUSTOM_ORDERS_PAGE_SIZE,
  defaultCustomOrders,
} from "@/lib/custom-orders/defaults";
import {
  normalizeCustomOrder,
  sanitizeCustomOrders,
  validateCustomOrderCreate,
  validateCustomOrderStatus,
} from "@/lib/custom-orders/validation";
import { getProductById } from "@/lib/products/store";

const STORE_PATH = path.join(process.cwd(), "data", "custom-orders.json");

function ensureStoreDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readAllCustomOrders() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      if (Array.isArray(data.orders)) {
        return sanitizeCustomOrders(data.orders);
      }
    }
  } catch {
    // Fall back to defaults.
  }

  return sanitizeCustomOrders(defaultCustomOrders);
}

function writeCustomOrders(orders) {
  ensureStoreDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify({ orders }, null, 2));
}

function resolveProductReferences(productIds = []) {
  const titles = productIds
    .map((productId) => getProductById(productId)?.title || "")
    .filter(Boolean);

  return { productIds, productTitles: titles };
}

function paginate(items, page, limit) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

export function createCustomOrder(input = {}) {
  const error = validateCustomOrderCreate(input);
  if (error) {
    return { success: false, error };
  }

  const productIds = Array.isArray(input.productIds)
    ? input.productIds.filter(Boolean)
    : [];
  const { productTitles } = resolveProductReferences(productIds);

  if (productIds.length && productIds.length !== productTitles.length) {
    return { success: false, error: "One or more selected product references were not found." };
  }

  const now = new Date().toISOString();
  const order = normalizeCustomOrder({
    id: generateId(),
    userEmail: input.userEmail,
    userName: input.userName || "",
    mobile: input.mobile || "",
    details: input.details,
    productIds,
    productTitles,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  const orders = readAllCustomOrders();
  orders.unshift(order);
  writeCustomOrders(orders);

  return { success: true, order };
}

export function getCustomOrderById(id) {
  return readAllCustomOrders().find((order) => order.id === id) || null;
}

export function getCustomOrdersByUserEmail(userEmail, { page = 1, limit = CUSTOM_ORDERS_PAGE_SIZE } = {}) {
  const normalizedEmail = normalizeEmail(userEmail);
  const orders = readAllCustomOrders()
    .filter((order) => order.userEmail === normalizedEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { items, pagination } = paginate(orders, page, limit);
  return { orders: items, pagination };
}

export function getCustomOrdersQuery({
  page = 1,
  limit = CUSTOM_ORDERS_ADMIN_PAGE_SIZE,
  search = "",
  status = "",
} = {}) {
  let orders = readAllCustomOrders();
  const query = search.trim().toLowerCase();

  if (query) {
    orders = orders.filter(
      (order) =>
        order.userEmail.toLowerCase().includes(query) ||
        order.userName.toLowerCase().includes(query) ||
        order.details.toLowerCase().includes(query) ||
        order.productTitles.join(" ").toLowerCase().includes(query) ||
        order.mobile.toLowerCase().includes(query)
    );
  }

  if (status) {
    orders = orders.filter((order) => order.status === status);
  }

  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { items, pagination } = paginate(orders, page, limit);
  return { orders: items, pagination };
}

export function updateCustomOrderStatus(id, status) {
  const error = validateCustomOrderStatus(status);
  if (error) {
    return { success: false, error };
  }

  const orders = readAllCustomOrders();
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    return { success: false, error: "Custom order request not found." };
  }

  const updatedOrder = normalizeCustomOrder({
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  });

  orders[index] = updatedOrder;
  writeCustomOrders(orders);

  return { success: true, order: updatedOrder };
}
