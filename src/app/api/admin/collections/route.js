import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { createCollection, getCollectionsQuery } from "@/lib/collections/store";

function parseQueryParams(request) {
  const { searchParams } = new URL(request.url);

  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 10),
    search: searchParams.get("search") || "",
    trending: searchParams.get("trending") || "",
  };
}

export async function GET(request) {
  const email = request.headers.get("x-admin-email");
  const auth = requireAdminEmail(email);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const result = getCollectionsQuery(parseQueryParams(request));
    return jsonSuccess(result);
  } catch (error) {
    console.error("admin collections GET error:", error);
    return jsonError("Failed to load collections.", 500);
  }
}

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);
    const auth = requireAdminEmail(body?.email);

    if (!auth.ok) {
      return auth.response;
    }

    const result = createCollection(body.collection);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({ collection: result.collection, message: "Collection created." });
  } catch (error) {
    console.error("admin collections POST error:", error);
    return jsonError("Failed to create collection.", 500);
  }
}
