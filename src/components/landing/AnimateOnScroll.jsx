"use client";

import { useRef } from "react";
import { useScrollReveal } from "@/hooks/useGsapReveal";

export default function AnimateOnScroll({
  children,
  className = "",
  stagger = 0.1,
  start,
  y,
  triggerKey,
  disabled = false,
}) {
  const ref = useRef(null);

  useScrollReveal(
    ref,
    {
      stagger,
      start,
      y,
      disabled,
    },
    [triggerKey, disabled]
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
