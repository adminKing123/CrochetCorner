import { defaultHeroSlides } from "@/lib/hero-slides/defaults";
import { sanitizeHeroSlides, validateHeroSlides } from "@/lib/hero-slides/validation";
import {
  FIRESTORE_COLLECTIONS,
  getDocument,
  setDocument,
} from "@/lib/firebase/firestore";

const SETTINGS_DOC_ID = "heroSlides";

async function readHeroSlidesDoc() {
  const doc = await getDocument(FIRESTORE_COLLECTIONS.settings, SETTINGS_DOC_ID);

  if (doc?.slides?.length) {
    return sanitizeHeroSlides(doc.slides);
  }

  const slides = sanitizeHeroSlides(defaultHeroSlides);
  await setDocument(FIRESTORE_COLLECTIONS.settings, SETTINGS_DOC_ID, { slides });
  return slides;
}

export async function getHeroSlides() {
  return readHeroSlidesDoc();
}

export async function saveHeroSlides(slides) {
  const error = validateHeroSlides(slides);

  if (error) {
    return { success: false, error };
  }

  const sanitized = sanitizeHeroSlides(slides);
  await setDocument(FIRESTORE_COLLECTIONS.settings, SETTINGS_DOC_ID, { slides: sanitized });

  return { success: true, slides: sanitized };
}
