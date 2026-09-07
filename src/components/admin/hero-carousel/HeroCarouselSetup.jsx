"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "@/components/auth/ui";
import AdminShell from "@/components/admin/AdminShell";
import { MAX_HERO_SLIDES } from "@/lib/hero-slides/defaults";
import { fetchHeroSlides, saveHeroSlides } from "@/lib/hero-slides/client-api";
import { createEmptyHeroSlide } from "@/lib/hero-slides/validation";
import { auth } from "@/lib/firebase/client";

function HeroSlideFields({ slide, index, onChange, onRemove, canRemove }) {
  function updateField(field, value) {
    onChange({ ...slide, [field]: value });
  }

  return (
    <div className="rounded-2xl border border-peach/20 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-charcoal">Slide {index + 1}</h3>
        {canRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="font-body text-sm font-semibold text-red-600 transition hover:text-red-700"
          >
            Remove
          </button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AuthInput
          label="Desktop image URL"
          id={`slide-${slide.id}-src`}
          value={slide.src}
          onChange={(event) => updateField("src", event.target.value)}
          placeholder="https://..."
          required
        />
        <AuthInput
          label="Mobile image URL"
          id={`slide-${slide.id}-srcMobile`}
          value={slide.srcMobile}
          onChange={(event) => updateField("srcMobile", event.target.value)}
          placeholder="https://..."
          required
        />
        <AuthInput
          label="Alt text"
          id={`slide-${slide.id}-alt`}
          value={slide.alt}
          onChange={(event) => updateField("alt", event.target.value)}
          placeholder="Slide description"
        />
        <AuthInput
          label="Redirect URL (optional)"
          id={`slide-${slide.id}-redirectUrl`}
          value={slide.redirectUrl}
          onChange={(event) => updateField("redirectUrl", event.target.value)}
          placeholder="https://... or /shop"
        />
      </div>
    </div>
  );
}

export default function HeroCarouselSetup() {
  const [userEmail, setUserEmail] = useState("");
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email || "");
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    fetchHeroSlides()
      .then(setSlides)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateSlide(index, updatedSlide) {
    setSlides((current) => current.map((slide, i) => (i === index ? updatedSlide : slide)));
  }

  function addSlide() {
    if (slides.length >= MAX_HERO_SLIDES) return;
    setSlides((current) => [...current, createEmptyHeroSlide(current.length)]);
  }

  function removeSlide(index) {
    setSlides((current) => current.filter((_, i) => i !== index));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const saved = await saveHeroSlides(userEmail, slides);
      setSlides(saved);
      setSuccess("Hero carousel saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell
      title="Hero Carousel Setup"
      description="Manage up to 5 homepage slides. Add image URLs and optional redirect links."
    >
      {loading ? (
        <p className="font-body text-charcoal/70">Loading slides...</p>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <AuthError message={error} />
          <AuthSuccess message={success} />

          <div className="space-y-4">
            {slides.map((slide, index) => (
              <HeroSlideFields
                key={slide.id}
                slide={slide}
                index={index}
                onChange={(updated) => updateSlide(index, updated)}
                onRemove={() => removeSlide(index)}
                canRemove={slides.length > 1}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={addSlide}
              disabled={slides.length >= MAX_HERO_SLIDES}
              className="font-body text-sm font-semibold text-mint transition hover:text-mint-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              + Add slide ({slides.length}/{MAX_HERO_SLIDES})
            </button>

            <AuthButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save carousel"}
            </AuthButton>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
