import { generateId } from "@/lib/generate-id";

export function normalizeProduct(product, index = 0) {
  return {
    id: product.id || generateId(),
    title: product.title?.trim() || `Product ${index + 1}`,
    imageSquare: product.imageSquare?.trim() || "",
    imagePortrait: product.imagePortrait?.trim() || "",
    originalPrice: Number(product.originalPrice ?? product.costPrice) || 0,
    sellingPrice: Number(product.sellingPrice) || 0,
    isBestSeller: Boolean(product.isBestSeller),
    keyIds: Array.isArray(product.keyIds) ? product.keyIds.filter(Boolean) : [],
    categoryIds: Array.isArray(product.categoryIds)
      ? product.categoryIds.filter(Boolean)
      : [],
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
  };
}

export function validateProduct(product) {
  const normalized = normalizeProduct(product);

  if (!normalized.title) {
    return "Product title is required.";
  }

  if (!normalized.imageSquare || !normalized.imagePortrait) {
    return "Both square (1:1) and portrait (2:3) image URLs are required.";
  }

  if (normalized.originalPrice < 0 || normalized.sellingPrice < 0) {
    return "Prices cannot be negative.";
  }

  return null;
}

export function createEmptyProduct() {
  return normalizeProduct({
    title: "",
    imageSquare: "",
    imagePortrait: "",
    originalPrice: 0,
    sellingPrice: 0,
    isBestSeller: false,
    keyIds: [],
    categoryIds: [],
  });
}

export function sanitizeProducts(products) {
  return products.map((product, index) => normalizeProduct(product, index));
}
