import fs from "fs";
import path from "path";
import { PRODUCTS_PAGE_SIZE, defaultProducts } from "@/lib/products/defaults";
import { parseIdList } from "@/lib/products/filters";
import { normalizeProduct, sanitizeProducts, validateProduct } from "@/lib/products/validation";

const STORE_PATH = path.join(process.cwd(), "data", "products.json");

function ensureStoreDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readAllProducts() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      if (Array.isArray(data.products)) {
        return sanitizeProducts(data.products);
      }
    }
  } catch {
    // Fall back to defaults.
  }

  return sanitizeProducts(defaultProducts);
}

function writeProducts(products) {
  ensureStoreDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify({ products }, null, 2));
}

export function getProductsQuery({
  page = 1,
  limit = PRODUCTS_PAGE_SIZE,
  search = "",
  bestSeller = "",
  category = "",
  keys = "",
} = {}) {
  let products = readAllProducts();

  const query = search.trim().toLowerCase();
  const categoryIds = parseIdList(category);
  const keyIds = parseIdList(keys);

  if (query) {
    products = products.filter((product) =>
      product.title.toLowerCase().includes(query)
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

  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * limit;

  return {
    products: products.slice(start, start + limit),
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
    },
  };
}

export function getProductById(id) {
  return readAllProducts().find((product) => product.id === id) || null;
}

export function createProduct(input) {
  const error = validateProduct(input);

  if (error) {
    return { success: false, error };
  }

  const products = readAllProducts();
  const product = normalizeProduct({
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  products.unshift(product);
  writeProducts(products);

  return { success: true, product };
}

export function updateProduct(id, input) {
  const products = readAllProducts();
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return { success: false, error: "Product not found." };
  }

  const error = validateProduct({ ...products[index], ...input, id });

  if (error) {
    return { success: false, error };
  }

  const product = normalizeProduct(
    {
      ...products[index],
      ...input,
      id,
      createdAt: products[index].createdAt,
      updatedAt: new Date().toISOString(),
    },
    index
  );

  products[index] = product;
  writeProducts(products);

  return { success: true, product };
}

export function deleteProduct(id) {
  const products = readAllProducts();
  const nextProducts = products.filter((product) => product.id !== id);

  if (nextProducts.length === products.length) {
    return { success: false, error: "Product not found." };
  }

  writeProducts(nextProducts);
  return { success: true };
}
