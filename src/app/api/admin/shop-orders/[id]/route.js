import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { updateShopOrderStatus } from "@/lib/shop-orders/store";

export async function PATCH(request, { params }) {
  try {
    const body = await parseJsonBody(request);
    const auth = requireAdminEmail(body?.email);

    if (!auth.ok) {
      return auth.response;
    }

    const { id } = await params;
    const result = updateShopOrderStatus(id, body?.status);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({
      order: result.order,
      message: "Order status updated.",
    });
  } catch (error) {
    console.error("admin shop-orders PATCH error:", error);
    return jsonError("Failed to update order status.", 500);
  }
}
