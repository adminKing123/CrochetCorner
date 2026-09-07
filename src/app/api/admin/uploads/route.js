import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAdminEmail } from "@/lib/admin/verify-request";
import { createUpload, getUploadsQuery } from "@/lib/uploads/store";

function parseQueryParams(request) {
  const { searchParams } = new URL(request.url);

  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 12),
    search: searchParams.get("search") || "",
  };
}

export async function GET(request) {
  const email = request.headers.get("x-admin-email");
  const auth = requireAdminEmail(email);

  if (!auth.ok) {
    return auth.response;
  }

  try {
    const result = await getUploadsQuery(parseQueryParams(request));
    return jsonSuccess(result);
  } catch (error) {
    console.error("admin uploads GET error:", error);
    return jsonError("Failed to load uploads.", 500);
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const auth = requireAdminEmail(formData.get("email"));

    if (!auth.ok) {
      return auth.response;
    }

    const file = formData.get("file");
    const title = String(formData.get("title") || "");
    const aspectRatio = String(formData.get("aspectRatio") || "");

    if (!(file instanceof File) || file.size === 0) {
      return jsonError("Please choose an image file to upload.", 400);
    }

    const result = await createUpload({ file, title, aspectRatio });

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({ upload: result.upload, message: "Image uploaded successfully." });
  } catch (error) {
    console.error("admin uploads POST error:", error);
    return jsonError("Failed to upload image.", 500);
  }
}
