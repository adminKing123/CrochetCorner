import { jsonError, jsonSuccess, parseJsonBody } from "@/lib/api/response";
import { isAdminEmail } from "@/lib/auth/admin";
import { getHeroSlides, saveHeroSlides } from "@/lib/hero-slides/store";

export async function GET(request) {
  const email = request.headers.get("x-admin-email");

  if (!isAdminEmail(email)) {
    return jsonError("Unauthorized.", 403);
  }

  try {
    const slides = getHeroSlides();
    return jsonSuccess({ slides });
  } catch (error) {
    console.error("admin hero-slides GET error:", error);
    return jsonError("Failed to load hero slides.", 500);
  }
}

export async function PUT(request) {
  try {
    const body = await parseJsonBody(request);

    if (!body) {
      return jsonError("Invalid request body.", 400);
    }

    if (!isAdminEmail(body.email)) {
      return jsonError("Unauthorized.", 403);
    }

    const result = saveHeroSlides(body.slides);

    if (!result.success) {
      return jsonError(result.error, 400);
    }

    return jsonSuccess({ slides: result.slides, message: "Hero carousel saved." });
  } catch (error) {
    console.error("admin hero-slides PUT error:", error);
    return jsonError("Failed to save hero slides.", 500);
  }
}
