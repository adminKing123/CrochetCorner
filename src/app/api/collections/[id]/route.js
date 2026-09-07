import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getCollectionById } from "@/lib/collections/store";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const collection = getCollectionById(id);

    if (!collection) {
      return jsonError("Collection not found.", 404);
    }

    return jsonSuccess({ collection });
  } catch (error) {
    console.error("collection GET error:", error);
    return jsonError("Failed to load collection.", 500);
  }
}
