import fs from "fs";
import path from "path";
import { generateId } from "@/lib/generate-id";
import { normalizeEmail } from "@/lib/api/response";
import { getProductById } from "@/lib/products/store";
import {
  SHOP_ORDERS_ADMIN_PAGE_SIZE,
  SHOP_ORDERS_PAGE_SIZE,
  defaultShopOrders,
} from "@/lib/shop-orders/defaults";
import {
  normalizeShopOrder,
  normalizeShopOrderItem,
  sanitizeShopOrders,
  validateShopOrderCreate,
  validateShopOrderStatus,
} from "@/lib/shop-orders/validation";

const STORE_PATH = path.join(process.cwd(), "data", "shop-orders.json");

function ensureStoreDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readAllShopOrders() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      if (Array.isArray(data.orders)) {
        return sanitizeShopOrders(data.orders);
      }
    }
  } catch {
    // Fall back to defaults.
  }

  return sanitizeShopOrders(defaultShopOrders);
}

function writeShopOrders(orders) {
  ensureStoreDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify({ orders }, null, 2));
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

function resolveOrderItems(items = []) {
  const resolvedItems = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) {
      return { error: `Product "${item.productId}" is no longer available.` };
    }

    const quantity = Math.max(1, Number.parseInt(item.quantity, 10) || 1);
    const unitPrice = Number(product.sellingPrice) || 0;

    resolvedItems.push(
      normalizeShopOrderItem({
        productId: product.id,
        title: product.title,
        quantity,
        unitPrice,
        lineTotal: unitPrice * quantity,
        imageSquare: product.imageSquare,
      })
    );
  }

  const subtotal = resolvedItems.reduce((total, item) => total + item.lineTotal, 0);

  return { items: resolvedItems, subtotal };
}

export function createShopOrder(input = {}) {
  const error = validateShopOrderCreate(input);
  if (error) {
    return { success: false, error };
  }

  const resolved = resolveOrderItems(input.items);
  if (resolved.error) {
    return { success: false, error: resolved.error };
  }

  const now = new Date().toISOString();
  const order = normalizeShopOrder({
    id: generateId(),
    userEmail: input.userEmail,
    userName: input.userName || "",
    mobile: input.mobile || "",
    deliveryNotes: input.deliveryNotes || "",
    items: resolved.items,
    subtotal: resolved.subtotal,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });

  const orders = readAllShopOrders();
  orders.unshift(order);
  writeShopOrders(orders);

  return { success: true, order };
}

export function getShopOrderById(id) {
  return readAllShopOrders().find((order) => order.id === id) || null;
}

export function getShopOrdersByUserEmail(
  userEmail,
  { page = 1, limit = SHOP_ORDERS_PAGE_SIZE } = {}
) {
  const normalizedEmail = normalizeEmail(userEmail);
  const orders = readAllShopOrders()
    .filter((order) => order.userEmail === normalizedEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { items, pagination } = paginate(orders, page, limit);
  return { orders: items, pagination };
}

export function getShopOrdersQuery({
  page = 1,
  limit = SHOP_ORDERS_ADMIN_PAGE_SIZE,
  search = "",
  status = "",
} = {}) {
  let orders = readAllShopOrders();
  const query = search.trim().toLowerCase();

  if (query) {
    orders = orders.filter(
      (order) =>
        order.userEmail.toLowerCase().includes(query) ||
        order.userName.toLowerCase().includes(query) ||
        order.mobile.toLowerCase().includes(query) ||
        order.deliveryNotes.toLowerCase().includes(query) ||
        order.items.some(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.productId.toLowerCase().includes(query)
        )
    );
  }

  if (status) {
    orders = orders.filter((order) => order.status === status);
  }

  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { items, pagination } = paginate(orders, page, limit);
  return { orders: items, pagination };
}

export function updateShopOrderStatus(id, status) {
  const error = validateShopOrderStatus(status);
  if (error) {
    return { success: false, error };
  }

  const orders = readAllShopOrders();
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    return { success: false, error: "Shop order not found." };
  }

  const updatedOrder = normalizeShopOrder({
    ...orders[index],
    status,
    updatedAt: new Date().toISOString(),
  });

  orders[index] = updatedOrder;
  writeShopOrders(orders);

  return { success: true, order: updatedOrder };
}
