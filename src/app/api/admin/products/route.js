import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { createProduct, getProductsQuery } from "@/lib/products/store";

function parseQueryParams(request) {
  const { searchParams } = new URL(request.url);

  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 10),
    search: searchParams.get("search") || "",
    bestSeller: searchParams.get("bestSeller") || "",
  };
}

export async function GET(request) {
  const email = request.headers.get("x-admin-email");
  const auth = requireAdminEmail(email);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const result = getProductsQuery(parseQueryParams(request));
    return jsonSuccess(result);
  } catch (error) {
    console.error("admin products GET error:", error);
    return jsonError("Failed to load products.", 500);
  }
}

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);
    const auth = requireAdminEmail(body?.email);

    if (!auth.ok) {
      return auth.response;
    }

    const result = createProduct(body.product);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({ product: result.product, message: "Product created." });
  } catch (error) {
    console.error("admin products POST error:", error);
    return jsonError("Failed to create product.", 500);
  }
}
