import { TAXONOMY_SEARCH_LIMIT } from "@/lib/taxonomy/defaults";

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

export function createTaxonomyClientApi(type) {
  const basePath = `/api/${type}`;

  return {
    search(params = {}) {
      return fetch(`${basePath}${buildQuery({ limit: TAXONOMY_SEARCH_LIMIT, ...params })}`, {
        cache: "no-store",
      }).then(parseResponse);
    },
    listAdmin(email, params = {}) {
      return fetch(`/api/admin/${type}${buildQuery({ ...params, email })}`, {
        cache: "no-store",
        headers: { "x-admin-email": email },
      }).then(parseResponse);
    },
    create(email, item) {
      return fetch(`/api/admin/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, item }),
      }).then(parseResponse);
    },
    update(email, id, item) {
      return fetch(`/api/admin/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, item }),
      }).then(parseResponse);
    },
    delete(email, id) {
      return fetch(`/api/admin/${type}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).then(parseResponse);
    },
  };
}

export const keysApi = createTaxonomyClientApi("keys");
export const categoriesApi = createTaxonomyClientApi("categories");
