import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { deleteProduct, getProductById, updateProduct } from "@/lib/products/store";

export async function GET(_request, { params }) {
  const email = _request.headers.get("x-admin-email");
  const auth = requireAdminEmail(email);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return jsonError("Product not found.", 404);
    }

    return jsonSuccess({ product });
  } catch (error) {
    console.error("admin product GET error:", error);
    return jsonError("Failed to load product.", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await parseJsonBody(request);
    const auth = requireAdminEmail(body?.email);

    if (!auth.ok) {
      return auth.response;
    }

    const { id } = await params;
    const result = await updateProduct(id, body.product);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({ product: result.product, message: "Product updated." });
  } catch (error) {
    console.error("admin product PUT error:", error);
    return jsonError("Failed to update product.", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const body = await parseJsonBody(request);
    const auth = requireAdminEmail(body?.email);

    if (!auth.ok) {
      return auth.response;
    }

    const { id } = await params;
    const result = await deleteProduct(id);

    if (!result.success) {
      return jsonError(result.error, 404);
    }

    return jsonSuccess({ message: "Product deleted." });
  } catch (error) {
    console.error("admin product DELETE error:", error);
    return jsonError("Failed to delete product.", 500);
  }
}
