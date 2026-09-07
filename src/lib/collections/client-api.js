import { TRENDING_COLLECTIONS_LIMIT } from "@/lib/collections/defaults";

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

export async function fetchCollections(params = {}) {
  const response = await fetch(`/api/collections${buildQuery(params)}`, {
    cache: "no-store",
  });
  return parseResponse(response);
}

export async function fetchTrendingCollections(limit = TRENDING_COLLECTIONS_LIMIT) {
  const data = await fetchCollections({ trending: "true", limit, page: 1 });
  return data.collections || [];
}

export async function fetchWeeklyCollection() {
  const response = await fetch("/api/collections/weekly", { cache: "no-store" });
  const data = await parseResponse(response);
  return data.collection || null;
}

export async function fetchCollection(id) {
  const response = await fetch(`/api/collections/${id}`, { cache: "no-store" });
  return parseResponse(response);
}

export async function fetchCollectionsAdmin(email, params = {}) {
  const response = await fetch(`/api/admin/collections${buildQuery(params)}`, {
    cache: "no-store",
    headers: { "x-admin-email": email },
  });
  return parseResponse(response);
}

export async function fetchCollectionAdmin(email, id) {
  const response = await fetch(`/api/admin/collections/${id}`, {
    cache: "no-store",
    headers: { "x-admin-email": email },
  });
  return parseResponse(response);
}

export async function createCollection(email, collection) {
  const response = await fetch("/api/admin/collections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, collection }),
  });
  return parseResponse(response);
}

export async function updateCollection(email, id, collection) {
  const response = await fetch(`/api/admin/collections/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, collection }),
  });
  return parseResponse(response);
}

export async function deleteCollection(email, id) {
  const response = await fetch(`/api/admin/collections/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parseResponse(response);
}
