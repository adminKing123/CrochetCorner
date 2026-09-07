import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getProductById } from "@/lib/products/store";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return jsonError("Product not found.", 404);
    }

    return jsonSuccess({ product });
  } catch (error) {
    console.error("product GET error:", error);
    return jsonError("Failed to load product.", 500);
  }
}
