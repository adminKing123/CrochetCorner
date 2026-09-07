import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireUserEmail } from "@/lib/auth/verify-user";
import {
  sendCustomOrderAdminEmail,
  sendCustomOrderConfirmationEmail,
} from "@/lib/email";
import { createCustomOrder, getCustomOrdersByUserEmail } from "@/lib/custom-orders/store";

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
    const result = await getCustomOrdersByUserEmail(auth.email, parseQueryParams(request));
    return jsonSuccess(result);
  } catch (error) {
    console.error("custom-orders GET error:", error);
    return jsonError("Failed to load your custom order requests.", 500);
  }
}

export async function POST(request) {
  try {
    const body = await parseJsonBody(request);
    const auth = requireUserEmail(body?.email);

    if (!auth.ok) {
      return auth.response;
    }

    const result = await createCustomOrder({
      userEmail: auth.email,
      userName: body?.userName || "",
      details: body?.order?.details,
      mobile: body?.order?.mobile,
      productIds: body?.order?.productIds,
    });

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    try {
      await sendCustomOrderAdminEmail(result.order);
      await sendCustomOrderConfirmationEmail(result.order);
    } catch (emailError) {
      console.error("custom order email error:", emailError);
    }

    return jsonSuccess({
      order: result.order,
      message: "Custom order request submitted successfully.",
    });
  } catch (error) {
    console.error("custom-orders POST error:", error);
    return jsonError("Failed to submit custom order request.", 500);
  }
}
