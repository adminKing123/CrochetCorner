"use client";

import { useState } from "react";

const aspectClasses = {
  "1/1": "aspect-square",
  "2/3": "aspect-[2/3]",
};

export default function ProductImage({
  src,
  alt,
  aspectRatio = "2/3",
  className = "",
  imageClassName = "",
  priority = false,
}) {
  const [error, setError] = useState(false);
  const aspectClass = aspectClasses[aspectRatio] || aspectClasses["2/3"];

  return (
    <div className={`relative overflow-hidden bg-peach/5 ${aspectClass} ${className}`}>
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setError(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
        />
      ) : (
        <div className="flex h-full min-h-[120px] items-center justify-center p-4 text-center font-body text-sm text-charcoal/45">
          {src && error ? "Image unavailable" : "No image"}
        </div>
      )}
    </div>
  );
}
