import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { updateCustomOrderStatus } from "@/lib/custom-orders/store";

export async function PATCH(request, { params }) {
  try {
    const body = await parseJsonBody(request);
    const auth = requireAdminEmail(body?.email);

    if (!auth.ok) {
      return auth.response;
    }

    const { id } = await params;
    const result = updateCustomOrderStatus(id, body?.status);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({
      order: result.order,
      message: "Custom order status updated.",
    });
  } catch (error) {
    console.error("admin custom-orders PATCH error:", error);
    return jsonError("Failed to update custom order status.", 500);
  }
}
