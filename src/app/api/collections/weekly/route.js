import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getWeeklyCollection } from "@/lib/collections/store";

export async function GET() {
  try {
    const collection = getWeeklyCollection();
    return jsonSuccess({ collection });
  } catch (error) {
    console.error("collections weekly GET error:", error);
    return jsonError("Failed to load weekly collection.", 500);
  }
}
