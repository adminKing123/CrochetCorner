import crypto from "crypto";
import { MAX_HERO_SLIDES } from "@/lib/hero-slides/defaults";

export function createEmptyHeroSlide(index = 0) {
  return {
    id: crypto.randomUUID(),
    src: "",
    srcMobile: "",
    alt: `Hero slide ${index + 1}`,
    redirectUrl: "",
  };
}

export function normalizeHeroSlide(slide, index = 0) {
  return {
    id: slide.id || crypto.randomUUID(),
    src: slide.src?.trim() || "",
    srcMobile: slide.srcMobile?.trim() || "",
    alt: slide.alt?.trim() || `Hero slide ${index + 1}`,
    redirectUrl: slide.redirectUrl?.trim() || "",
  };
}

export function validateHeroSlides(slides) {
  if (!Array.isArray(slides)) {
    return "Slides must be an array.";
  }

  if (slides.length === 0) {
    return "Add at least one slide.";
  }

  if (slides.length > MAX_HERO_SLIDES) {
    return `You can add at most ${MAX_HERO_SLIDES} slides.`;
  }

  for (let index = 0; index < slides.length; index += 1) {
    const slide = normalizeHeroSlide(slides[index], index);

    if (!slide.src || !slide.srcMobile) {
      return `Slide ${index + 1} needs both desktop and mobile image URLs.`;
    }
  }

  return null;
}

export function sanitizeHeroSlides(slides) {
  return slides.map((slide, index) => normalizeHeroSlide(slide, index));
}
