"use client";

import { useCallback, useEffect, useState } from "react";
import HeroSlideImage, { HeroSlideWrapper } from "@/components/hero/HeroSlide";
import { fetchHeroSlides } from "@/lib/hero-slides/client-api";

export default function HeroCarousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetchHeroSlides()
      .then(setSlides)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const slideCount = slides.length;

  const goTo = useCallback(
    (index) => {
      setCurrent((index + slideCount) % slideCount);
    },
    [slideCount]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;

    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, slideCount]);

  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-cream">
        <div className="relative aspect-[0.63/1] w-full animate-pulse bg-peach/10 md:aspect-[2.77/1]" />
      </section>
    );
  }

  if (slideCount === 0) return null;

  return (
    <section aria-label="Hero carousel" className="relative w-full overflow-hidden bg-cream">
      <div className="relative aspect-[0.63/1] w-full md:aspect-[2.77/1]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== current}
          >
            <HeroSlideWrapper
              slide={slide}
              className={`relative h-full w-full ${
                slide.redirectUrl?.trim() ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <HeroSlideImage slide={slide} priority={index === 0} className="absolute inset-0" />
            </HeroSlideWrapper>
          </div>
        ))}

        {slideCount > 1 ? (
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((slide, index) => (
              <button
                key={`${slide.id}-dot`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === current}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === current
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
