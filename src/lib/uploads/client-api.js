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

export async function fetchUploadsAdmin(email, params = {}) {
  const response = await fetch(`/api/admin/uploads${buildQuery(params)}`, {
    cache: "no-store",
    headers: { "x-admin-email": email },
  });
  return parseResponse(response);
}

export async function fetchUploadAdmin(email, id) {
  const response = await fetch(`/api/admin/uploads/${id}`, {
    cache: "no-store",
    headers: { "x-admin-email": email },
  });
  return parseResponse(response);
}

export async function createUploadAdmin(email, { file, title = "", aspectRatio }) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("title", title);
  formData.append("aspectRatio", aspectRatio);
  formData.append("file", file);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });
  return parseResponse(response);
}

export async function updateUploadAdmin(email, id, { file, title, aspectRatio }) {
  const formData = new FormData();
  formData.append("email", email);
  if (title !== undefined) {
    formData.append("title", title);
  }
  if (aspectRatio !== undefined) {
    formData.append("aspectRatio", aspectRatio);
  }
  if (file) {
    formData.append("file", file);
  }

  const response = await fetch(`/api/admin/uploads/${id}`, {
    method: "PUT",
    body: formData,
  });
  return parseResponse(response);
}

export async function deleteUploadAdmin(email, id) {
  const response = await fetch(`/api/admin/uploads/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return parseResponse(response);
}
