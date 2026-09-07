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

export async function createCustomOrder(email, order, userName = "") {
  const response = await fetch("/api/custom-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      userName,
      order: {
        details: order.details,
        mobile: order.mobile,
        productIds: order.productIds,
      },
    }),
  });
  return parseResponse(response);
}

export async function fetchMyCustomOrders(email, params = {}) {
  const response = await fetch(`/api/custom-orders${buildQuery(params)}`, {
    cache: "no-store",
    headers: { "x-user-email": email },
  });
  return parseResponse(response);
}

export async function fetchCustomOrdersAdmin(email, params = {}) {
  const response = await fetch(`/api/admin/custom-orders${buildQuery(params)}`, {
    cache: "no-store",
    headers: { "x-admin-email": email },
  });
  return parseResponse(response);
}

export async function updateCustomOrderStatusAdmin(email, id, status) {
  const response = await fetch(`/api/admin/custom-orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, status }),
  });
  return parseResponse(response);
}
