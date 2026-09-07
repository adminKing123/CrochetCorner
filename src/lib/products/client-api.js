import { BEST_SELLERS_LIMIT } from "@/lib/products/defaults";

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function parseResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export async function fetchProducts(params = {}) {
  const response = await fetch(`/api/products${buildQuery(params)}`, {
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function fetchBestSellers(limit = BEST_SELLERS_LIMIT) {
  const data = await fetchProducts({ bestSeller: "true", limit, page: 1 });
  return data.products || [];
}

export async function fetchPublicProductsByIds(ids = [], limit) {
  if (!ids.length) {
    return [];
  }

  const data = await fetchProducts({
    ids: ids.join(","),
    limit: limit ?? ids.length,
    page: 1,
  });

  const productMap = new Map((data.products || []).map((product) => [product.id, product]));

  return ids
    .map((id) => productMap.get(id))
    .filter(Boolean)
    .slice(0, limit ?? ids.length);
}

export async function fetchProduct(id) {
  const response = await fetch(`/api/products/${id}`, { cache: "no-store" });
  return parseResponse(response);
}

export async function createProduct(email, product) {
  const response = await fetch("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, product }),
  });
  return parseResponse(response);
}

export async function updateProduct(email, id, product) {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, product }),
  });
  return parseResponse(response);
}

export async function deleteProduct(email, id) {
  const response = await fetch(`/api/admin/products/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parseResponse(response);
}

export async function fetchProductsAdmin(email, params = {}) {
  const response = await fetch(`/api/admin/products${buildQuery(params)}`, {
    cache: "no-store",
    headers: { "x-admin-email": email },
  });
  return parseResponse(response);
}

export async function searchProductsForPicker(email, search) {
  const data = await fetchProductsAdmin(email, { search, limit: 25, page: 1 });
  return {
    items: (data.products || []).map((product) => ({
      ...product,
      name: product.title,
    })),
  };
}

export async function fetchProductsByIds(email, ids = []) {
  if (!ids.length) {
    return { items: [] };
  }

  const data = await fetchProductsAdmin(email, {
    ids: ids.join(","),
    limit: ids.length,
  });

  return {
    items: (data.products || []).map((product) => ({
      ...product,
      name: product.title,
    })),
  };
}
