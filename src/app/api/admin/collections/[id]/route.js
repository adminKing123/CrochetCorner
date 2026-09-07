import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import {
  deleteCollection,
  getCollectionById,
  updateCollection,
} from "@/lib/collections/store";

export async function GET(_request, { params }) {
  const email = _request.headers.get("x-admin-email");
  const auth = requireAdminEmail(email);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const collection = getCollectionById(id);

    if (!collection) {
      return jsonError("Collection not found.", 404);
    }

    return jsonSuccess({ collection });
  } catch (error) {
    console.error("admin collection GET error:", error);
    return jsonError("Failed to load collection.", 500);
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
    const result = updateCollection(id, body.collection);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({ collection: result.collection, message: "Collection updated." });
  } catch (error) {
    console.error("admin collection PUT error:", error);
    return jsonError("Failed to update collection.", 500);
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
    const result = deleteCollection(id);

    if (!result.success) {
      return jsonError(result.error, 404);
    }

    return jsonSuccess({ message: "Collection deleted." });
  } catch (error) {
    console.error("admin collection DELETE error:", error);
    return jsonError("Failed to delete collection.", 500);
  }
}
