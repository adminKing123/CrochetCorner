"use client";

import { useState } from "react";

export default function ProductImagePreview({ label, aspectRatio, src, alt }) {
  const [error, setError] = useState(false);
  const aspectClass = aspectRatio === "1/1" ? "aspect-square" : "aspect-[2/3]";

  return (
    <div>
      <p className="mb-2 font-body text-sm font-semibold text-charcoal">{label}</p>
      <div
        className={`relative overflow-hidden rounded-2xl border border-peach/20 bg-peach/5 ${aspectClass}`}
      >
        {src && !error ? (
          <img
            src={src}
            alt={alt || label}
            onError={() => setError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[120px] items-center justify-center p-4 text-center font-body text-sm text-charcoal/50">
            {src && error ? "Could not load image" : "Image preview"}
          </div>
        )}
      </div>
    </div>
  );
}
