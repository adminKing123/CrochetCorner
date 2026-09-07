export async function fetchHeroSlides() {
  const response = await fetch("/api/hero-slides", { cache: "no-store" });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load hero slides.");
  }

  return data.slides;
}

export async function saveHeroSlides(email, slides) {
  const response = await fetch("/api/admin/hero-slides", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, slides }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to save hero slides.");
  }

  return data.slides;
}
