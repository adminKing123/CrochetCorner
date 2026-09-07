import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getCollectionProductsQuery } from "@/lib/collections/store";

function parseQueryParams(request) {
  const { searchParams } = new URL(request.url);

  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 12),
    search: searchParams.get("search") || "",
  };
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = getCollectionProductsQuery(id, parseQueryParams(request));

    if (!result) {
      return jsonError("Collection not found.", 404);
    }

    return jsonSuccess(result);
  } catch (error) {
    console.error("collection products GET error:", error);
    return jsonError("Failed to load collection products.", 500);
  }
}
