import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireUserEmail } from "@/lib/auth/verify-user";
import {
  sendShopOrderAdminEmail,
  sendShopOrderConfirmationEmail,
} from "@/lib/email";
import { createShopOrder, getShopOrdersByUserEmail } from "@/lib/shop-orders/store";

function parseQueryParams(request) {
  const { searchParams } = new URL(request.url);

  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 10),
  };
}

export async function GET(request) {
  const email = request.headers.get("x-user-email");
  const auth = requireUserEmail(email);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const result = getShopOrdersByUserEmail(auth.email, parseQueryParams(request));
    return jsonSuccess(result);
  } catch (error) {
    console.error("shop-orders GET error:", error);
    return jsonError("Failed to load your orders.", 500);
  }
}

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);
    const auth = requireUserEmail(body?.email);

    if (!auth.ok) {
      return auth.response;
    }

    const result = createShopOrder({
      userEmail: auth.email,
      userName: body?.userName || "",
      mobile: body?.order?.mobile,
      deliveryNotes: body?.order?.deliveryNotes,
      items: body?.order?.items,
    });

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    try {
      await sendShopOrderAdminEmail(result.order);
      await sendShopOrderConfirmationEmail(result.order);
    } catch (emailError) {
      console.error("shop order email error:", emailError);
    }

    return jsonSuccess({
      order: result.order,
      message: "Order placed successfully.",
    });
  } catch (error) {
    console.error("shop-orders POST error:", error);
    return jsonError("Failed to place order.", 500);
  }
}
