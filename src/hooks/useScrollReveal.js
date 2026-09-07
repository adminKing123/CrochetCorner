"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { registerGsapPlugins } from "@/lib/gsap/register";

const DEFAULT_ANIMATION = {
  y: 48,
  opacity: 0,
  duration: 0.7,
  ease: "power2.out",
  stagger: 0.1,
};

const DEFAULT_SCROLL_TRIGGER = {
  start: "top 85%",
  once: true,
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useScrollReveal(
  containerRef,
  {
    enabled = true,
    selector = "[data-scroll-reveal]",
    animation = {},
    scrollTrigger = {},
    triggerKey = 0,
  } = {}
) {
  useEffect(() => {
    if (!enabled || !containerRef.current || prefersReducedMotion()) return;

    registerGsapPlugins();

    const container = containerRef.current;
    const targets = container.querySelectorAll(selector);

    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        ...DEFAULT_ANIMATION,
        ...animation,
        scrollTrigger: {
          trigger: container,
          ...DEFAULT_SCROLL_TRIGGER,
          ...scrollTrigger,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [enabled, containerRef, selector, triggerKey]);
}
