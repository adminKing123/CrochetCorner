import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getCollectionsQuery } from "@/lib/collections/store";

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
  try {
    const result = getCollectionsQuery(parseQueryParams(request));
    return jsonSuccess(result);
  } catch (error) {
    console.error("collections GET error:", error);
    return jsonError("Failed to load collections.", 500);
  }
}
