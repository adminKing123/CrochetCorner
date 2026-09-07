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
