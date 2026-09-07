import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { getCustomOrdersQuery } from "@/lib/custom-orders/store";

function parseQueryParams(request) {
  const { searchParams } = new URL(request.url);

  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 12),
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
  };
}

export async function GET(request) {
  const email = request.headers.get("x-admin-email");
  const auth = requireAdminEmail(email);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const result = getCustomOrdersQuery(parseQueryParams(request));
    return jsonSuccess(result);
  } catch (error) {
    console.error("admin custom-orders GET error:", error);
    return jsonError("Failed to load custom order requests.", 500);
  }
}
