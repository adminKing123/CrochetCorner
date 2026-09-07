import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getProductsQuery } from "@/lib/products/store";

function parseQueryParams(request) {
  const { searchParams } = new URL(request.url);

  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 10),
    search: searchParams.get("search") || "",
    bestSeller: searchParams.get("bestSeller") || "",
    category: searchParams.get("category") || "",
    keys: searchParams.get("keys") || "",
    ids: searchParams.get("ids") || "",
  };
}

export async function GET(request) {
  try {
    const result = await getProductsQuery(parseQueryParams(request));
    return jsonSuccess(result);
  } catch (error) {
    console.error("products GET error:", error);
    return jsonError("Failed to load products.", 500);
  }
}
