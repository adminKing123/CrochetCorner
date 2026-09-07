import { jsonError, jsonSuccess } from "@/lib/api/response";
import { getHeroSlides } from "@/lib/hero-slides/store";

export async function GET() {
  try {
    const slides = getHeroSlides();
    return jsonSuccess({ slides });
  } catch (error) {
    console.error("hero-slides GET error:", error);
    return jsonError("Failed to load hero slides.", 500);
  }
}
