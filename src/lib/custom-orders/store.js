import { generateId } from "@/lib/generate-id";
import { normalizeEmail } from "@/lib/api/response";
import {
  CUSTOM_ORDERS_ADMIN_PAGE_SIZE,
  CUSTOM_ORDERS_PAGE_SIZE,
} from "@/lib/custom-orders/defaults";
import {
  normalizeCustomOrder,
  sanitizeCustomOrders,
  validateCustomOrderCreate,
  validateCustomOrderStatus,
} from "@/lib/custom-orders/validation";
import { getProductById } from "@/lib/products/store";
import {
  FIRESTORE_COLLECTIONS,
  getDocument,
  listDocuments,
  paginateItems,
  setDocument,
} from "@/lib/firebase/firestore";

const COLLECTION = FIRESTORE_COLLECTIONS.customOrders;

async function readAllCustomOrders() {
  return sanitizeCustomOrders(await listDocuments(COLLECTION));
}

async function resolveProductReferences(productIds = []) {
  const titles = (
    await Promise.all(productIds.map((productId) => getProductById(productId)))
  )
    .map((product) => product?.title || "")
    .filter(Boolean);

  return { productIds, productTitles: titles };
}

export async function createCustomOrder(input = {}) {
  const error = validateCustomOrderCreate(input);
  if (error) {
    return { success: false, error };
  }

  const productIds = Array.isArray(input.productIds)
    ? input.productIds.filter(Boolean)
    : [];
  const { productTitles } = await resolveProductReferences(productIds);

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

  await setDocument(COLLECTION, order.id, order);

  return { success: true, order };
}

export async function getCustomOrderById(id) {
  const order = await getDocument(COLLECTION, id);
  return order ? normalizeCustomOrder(order) : null;
}

export async function getCustomOrdersByUserEmail(
  userEmail,
  { page = 1, limit = CUSTOM_ORDERS_PAGE_SIZE } = {}
) {
  const normalizedEmail = normalizeEmail(userEmail);
  const orders = (await readAllCustomOrders())
    .filter((order) => order.userEmail === normalizedEmail)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { items, pagination } = paginateItems(orders, page, limit);
  return { orders: items, pagination };
}

export async function getCustomOrdersQuery({
  page = 1,
  limit = CUSTOM_ORDERS_ADMIN_PAGE_SIZE,
  search = "",
  status = "",
} = {}) {
  let orders = await readAllCustomOrders();
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

  const { items, pagination } = paginateItems(orders, page, limit);
  return { orders: items, pagination };
}

export async function updateCustomOrderStatus(id, status) {
  const error = validateCustomOrderStatus(status);
  if (error) {
    return { success: false, error };
  }

  const existing = await getCustomOrderById(id);

  if (!existing) {
    return { success: false, error: "Custom order request not found." };
  }

  const updatedOrder = normalizeCustomOrder({
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  });

  await setDocument(COLLECTION, id, updatedOrder);

  return { success: true, order: updatedOrder };
}
