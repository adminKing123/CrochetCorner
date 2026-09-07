"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { heroSlides } from "@/config/site";

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const slideCount = heroSlides.length;

  const goTo = useCallback(
    (index) => {
      setCurrent((index + slideCount) % slideCount);
    },
    [slideCount]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (slideCount <= 1) return undefined;

    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext, slideCount]);

  if (slideCount === 0) return null;

  return (
    <section aria-label="Hero carousel" className="relative w-full overflow-hidden bg-cream">
      <div className="relative aspect-[21/9] min-h-[280px] w-full sm:min-h-[360px] lg:min-h-[480px]">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === current ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== current}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}

        {slideCount > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-md transition hover:bg-white"
            >
              <IoChevronBack className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-md transition hover:bg-white"
            >
              <IoChevronForward className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.src}
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
          </>
        ) : null}
      </div>
    </section>
  );
}
