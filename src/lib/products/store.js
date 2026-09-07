import { PRODUCTS_PAGE_SIZE, defaultProducts } from "@/lib/products/defaults";
import { parseIdList } from "@/lib/products/filters";
import { normalizeProduct, sanitizeProducts, validateProduct } from "@/lib/products/validation";
import {
  FIRESTORE_COLLECTIONS,
  getDocument,
  listDocuments,
  paginateItems,
  seedDocuments,
  setDocument,
  deleteDocument,
} from "@/lib/firebase/firestore";

const COLLECTION = FIRESTORE_COLLECTIONS.products;

async function readAllProducts() {
  const products = sanitizeProducts(await listDocuments(COLLECTION));

  if (!products.length) {
    const seeded = sanitizeProducts(defaultProducts);
    await seedDocuments(COLLECTION, seeded);
    return seeded;
  }

  return products;
}

export async function getProductsQuery({
  page = 1,
  limit = PRODUCTS_PAGE_SIZE,
  search = "",
  bestSeller = "",
  category = "",
  keys = "",
  ids = "",
} = {}) {
  let products = await readAllProducts();
  const idList = parseIdList(ids);

  if (idList.length) {
    const idSet = new Set(idList);
    products = products.filter((product) => idSet.has(product.id));

    return {
      products: products.slice(0, limit),
      pagination: {
        page: 1,
        limit,
        total: products.length,
        totalPages: 1,
      },
    };
  }

  const query = search.trim().toLowerCase();
  const categoryIds = parseIdList(category);
  const keyIds = parseIdList(keys);

  if (query) {
    products = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
    );
  }

  if (categoryIds.length) {
    products = products.filter((product) =>
      product.categoryIds?.some((id) => categoryIds.includes(id))
    );
  }

  if (keyIds.length) {
    products = products.filter((product) =>
      product.keyIds?.some((id) => keyIds.includes(id))
    );
  }

  if (bestSeller === "true") {
    products = products.filter((product) => product.isBestSeller);
  } else if (bestSeller === "false") {
    products = products.filter((product) => !product.isBestSeller);
  }

  products.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const { items, pagination } = paginateItems(products, page, limit);
  return { products: items, pagination };
}

export async function getProductById(id) {
  const product = await getDocument(COLLECTION, id);
  return product ? normalizeProduct(product) : null;
}

export async function createProduct(input) {
  const error = validateProduct(input);

  if (error) {
    return { success: false, error };
  }

  const product = normalizeProduct({
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await setDocument(COLLECTION, product.id, product);
  return { success: true, product };
}

export async function updateProduct(id, input) {
  const existing = await getProductById(id);

  if (!existing) {
    return { success: false, error: "Product not found." };
  }

  const error = validateProduct({ ...existing, ...input, id });

  if (error) {
    return { success: false, error };
  }

  const product = normalizeProduct({
    ...existing,
    ...input,
    id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  });

  await setDocument(COLLECTION, product.id, product);
  return { success: true, product };
}

export async function deleteProduct(id) {
  const existing = await getProductById(id);

  if (!existing) {
    return { success: false, error: "Product not found." };
  }

  await deleteDocument(COLLECTION, id);
  return { success: true };
}
