export function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const landingMotion = {
  duration: 0.75,
  ease: "power3.out",
  stagger: 0.1,
  y: 36,
  start: "top 85%",
};
