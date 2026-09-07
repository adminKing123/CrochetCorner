import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { deleteUpload, getUploadById, updateUpload } from "@/lib/uploads/store";

export async function GET(request, { params }) {
  const email = request.headers.get("x-admin-email");
  const auth = requireAdminEmail(email);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { id } = await params;
    const upload = getUploadById(id);

    if (!upload) {
      return jsonError("Upload not found.", 404);
    }

    return jsonSuccess({ upload });
  } catch (error) {
    console.error("admin upload GET error:", error);
    return jsonError("Failed to load upload.", 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const formData = await request.formData();
    const auth = requireAdminEmail(formData.get("email"));

    if (!auth.ok) {
      return auth.response;
    }

    const { id } = await params;
    const file = formData.get("file");
    const title = formData.has("title") ? String(formData.get("title") || "") : undefined;

    const result = await updateUpload(id, {
      file: file && typeof file !== "string" ? file : null,
      title,
    });

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({ upload: result.upload, message: "Upload updated successfully." });
  } catch (error) {
    console.error("admin upload PUT error:", error);
    return jsonError("Failed to update upload.", 500);
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
    const result = await deleteUpload(id);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({ message: "Upload deleted successfully." });
  } catch (error) {
    console.error("admin upload DELETE error:", error);
    return jsonError("Failed to delete upload.", 500);
  }
}
