import { generateId } from "@/lib/generate-id";
import { normalizeEmail } from "@/lib/api/response";
import { getProductById } from "@/lib/products/store";
import {
  SHOP_ORDERS_ADMIN_PAGE_SIZE,
  SHOP_ORDERS_PAGE_SIZE,
} from "@/lib/shop-orders/defaults";
import {
  normalizeShopOrder,
  normalizeShopOrderItem,
  sanitizeShopOrders,
  validateShopOrderCreate,
  validateShopOrderStatus,
} from "@/lib/shop-orders/validation";
import {
  FIRESTORE_COLLECTIONS,
  getDocument,
  listDocuments,
  paginateItems,
  setDocument,
} from "@/lib/firebase/firestore";

const COLLECTION = FIRESTORE_COLLECTIONS.shopOrders;

async function readAllShopOrders() {
  return sanitizeShopOrders(await listDocuments(COLLECTION));
}

async function resolveOrderItems(items = []) {
  const resolvedItems = [];

  for (const item of items) {
    const product = await getProductById(item.productId);
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

export async function createShopOrder(input = {}) {
  const error = validateShopOrderCreate(input);
  if (error) {
    return { success: false, error };
  }

  const resolved = await resolveOrderItems(input.items);
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

  await setDocument(COLLECTION, order.id, order);

  return { success: true, order };
}

export async function getShopOrderById(id) {
  const order = await getDocument(COLLECTION, id);
  return order ? normalizeShopOrder(order) : null;
}

export async function getShopOrdersByUserEmail(
  userEmail,
  { page = 1, limit = SHOP_ORDERS_PAGE_SIZE } = {}
) {
  const normalizedEmail = normalizeEmail(userEmail);
  const orders = (await readAllShopOrders())
    .filter((order) => order.userEmail === normalizedEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { items, pagination } = paginateItems(orders, page, limit);
  return { orders: items, pagination };
}

export async function getShopOrdersQuery({
  page = 1,
  limit = SHOP_ORDERS_ADMIN_PAGE_SIZE,
  search = "",
  status = "",
} = {}) {
  let orders = await readAllShopOrders();
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

  const { items, pagination } = paginateItems(orders, page, limit);
  return { orders: items, pagination };
}

export async function updateShopOrderStatus(id, status) {
  const error = validateShopOrderStatus(status);
  if (error) {
    return { success: false, error };
  }

  const existing = await getShopOrderById(id);

  if (!existing) {
    return { success: false, error: "Shop order not found." };
  }

  const updatedOrder = normalizeShopOrder({
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  });

  await setDocument(COLLECTION, id, updatedOrder);

  return { success: true, order: updatedOrder };
}
