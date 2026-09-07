"use client";

import Link from "next/link";
import CollectionBadges from "@/components/collections/CollectionBadges";
import CollectionDescription from "@/components/collections/CollectionDescription";
import ProductImage from "@/components/products/ProductImage";
import { authRoutes } from "@/config/site";

export default function CollectionCard({
  collection,
  priority = false,
  href = authRoutes.collectionDetail(collection.id),
  variant = "default",
  className = "",
  showBadges = false,
  showFullDescription = false,
}) {
  const productCount = collection.productIds.length;
  const productLabel = `${productCount} product${productCount === 1 ? "" : "s"}`;

  if (variant === "overlay") {
    return (
      <Link
        href={href}
        className={`group relative block aspect-square overflow-hidden rounded-2xl shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}
      >
        <ProductImage
          src={collection.imageSquare}
          alt={collection.title}
          aspectRatio="1/1"
          className="h-full rounded-2xl"
          imageClassName="transition duration-500 group-hover:scale-110"
          priority={priority}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
          <h3 className="font-display text-lg font-bold leading-snug text-white md:text-xl">
            {collection.title}
          </h3>
          <p className="mt-1 font-body text-sm text-white/80">{productLabel}</p>
        </div>
      </Link>
    );
  }

  if (variant === "landscape") {
    return (
      <Link
        href={href}
        className={`group flex h-[220px] flex-row overflow-hidden rounded-3xl border border-peach/15 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-peach/30 hover:shadow-lg md:h-[240px] ${className}`}
      >
        <div className="relative h-full w-[220px] shrink-0 overflow-hidden md:w-[240px]">
          <ProductImage
            src={collection.imageSquare}
            alt={collection.title}
            aspectRatio="1/1"
            className="!aspect-auto h-full w-full rounded-none"
            imageClassName="transition duration-500 group-hover:scale-105"
            priority={priority}
          />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col p-4 md:p-5">
          {showBadges ? (
            <CollectionBadges collection={collection} className="mb-1.5 shrink-0 md:mb-2" />
          ) : null}

          <h3 className="line-clamp-2 shrink-0 font-display text-base font-bold leading-normal text-charcoal transition group-hover:text-mint md:text-lg">
            {collection.title}
          </h3>

          <div className="mt-1.5 min-h-0 flex-1 overflow-hidden md:mt-2">
            {showFullDescription ? (
              collection.description ? (
                <p className="line-clamp-3 font-body text-sm leading-relaxed text-charcoal/70 md:text-base">
                  {collection.description}
                </p>
              ) : null
            ) : (
              <CollectionDescription
                description={collection.description}
                lines={3}
                className="md:text-base"
              />
            )}
          </div>

          <p className="mt-2 shrink-0 font-body text-sm text-charcoal/55">{productLabel}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-peach/15 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-peach/30 hover:shadow-lg ${className}`}
    >
      <ProductImage
        src={collection.imageSquare}
        alt={collection.title}
        aspectRatio="1/1"
        className="rounded-t-3xl"
        imageClassName="transition duration-500 group-hover:scale-105"
        priority={priority}
      />

      <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
        {showBadges ? <CollectionBadges collection={collection} /> : null}

        <h3 className="line-clamp-2 font-display text-lg font-bold leading-snug text-charcoal transition group-hover:text-mint">
          {collection.title}
        </h3>

        {showFullDescription ? (
          collection.description ? (
            <p className="font-body text-sm leading-relaxed text-charcoal/70">
              {collection.description}
            </p>
          ) : null
        ) : (
          <CollectionDescription description={collection.description} />
        )}

        <p className="mt-auto font-body text-sm text-charcoal/55">{productLabel}</p>
      </div>
    </Link>
  );
}
