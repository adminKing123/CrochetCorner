"use client";

import CollectionCard from "@/components/collections/CollectionCard";
import CollectionCardSkeleton from "@/components/collections/CollectionCardSkeleton";

const gridClassName =
  "grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6";

const landscapeGridClassName = "grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2";

const scrollClassName = "collection-scroll-track flex gap-4 md:gap-5";

function resolveTrackClassName(layout, cardVariant, className) {
  if (className) return className;
  if (layout === "scroll") return scrollClassName;
  if (cardVariant === "landscape") return landscapeGridClassName;
  return gridClassName;
}

export default function CollectionGrid({
  collections,
  loading,
  skeletonCount = 8,
  emptyMessage = "No collections found.",
  layout = "grid",
  cardVariant = "default",
  showBadges = false,
  className,
}) {
  const trackClassName = resolveTrackClassName(layout, cardVariant, className);
  const slideClassName =
    layout === "scroll" ? "collection-scroll-slide shrink-0 snap-start" : undefined;

  if (loading) {
    return (
      <div className={trackClassName}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <CollectionCardSkeleton
            key={`collection-skeleton-${index}`}
            variant={cardVariant}
            className={slideClassName}
          />
        ))}
      </div>
    );
  }

  if (!collections.length) {
    return (
      <div className="rounded-3xl border border-peach/20 bg-white px-6 py-16 text-center">
        <p className="font-body text-charcoal/70">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={trackClassName}>
      {collections.map((collection, index) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          priority={index < 4}
          variant={cardVariant}
          showBadges={showBadges}
          className={slideClassName}
        />
      ))}
    </div>
  );
}
