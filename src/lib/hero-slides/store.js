import fs from "fs";
import path from "path";
import { defaultHeroSlides } from "@/lib/hero-slides/defaults";
import { sanitizeHeroSlides, validateHeroSlides } from "@/lib/hero-slides/validation";

const STORE_PATH = path.join(process.cwd(), "data", "hero-slides.json");

function ensureStoreDir() {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readStoreFile() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
      if (Array.isArray(data.slides) && data.slides.length > 0) {
        return sanitizeHeroSlides(data.slides);
      }
    }
  } catch {
    // Fall back to defaults below.
  }

  return sanitizeHeroSlides(defaultHeroSlides);
}

export function getHeroSlides() {
  return readStoreFile();
}

export function saveHeroSlides(slides) {
  const error = validateHeroSlides(slides);

  if (error) {
    return { success: false, error };
  }

  const sanitized = sanitizeHeroSlides(slides);
  ensureStoreDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify({ slides: sanitized }, null, 2));

  return { success: true, slides: sanitized };
}
