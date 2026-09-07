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

export async function createShopOrder(email, order, userName = "") {
  const response = await fetch("/api/shop-orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      userName,
      order: {
        items: order.items,
        mobile: order.mobile,
        deliveryNotes: order.deliveryNotes,
      },
    }),
  });
  return parseResponse(response);
}

export async function fetchMyShopOrders(email, params = {}) {
  const response = await fetch(`/api/shop-orders${buildQuery(params)}`, {
    cache: "no-store",
    headers: { "x-user-email": email },
  });
  return parseResponse(response);
}

export async function fetchShopOrdersAdmin(email, params = {}) {
  const response = await fetch(`/api/admin/shop-orders${buildQuery(params)}`, {
    cache: "no-store",
    headers: { "x-admin-email": email },
  });
  return parseResponse(response);
}

export async function updateShopOrderStatusAdmin(email, id, status) {
  const response = await fetch(`/api/admin/shop-orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, status }),
  });
  return parseResponse(response);
}
