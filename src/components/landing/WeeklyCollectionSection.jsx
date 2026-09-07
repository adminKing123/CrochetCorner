"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CollectionProductPreviewStrip from "@/components/collections/CollectionProductPreviewStrip";
import ProductImage from "@/components/products/ProductImage";
import { LandingSectionFooterLink } from "@/components/landing/LandingSection";
import { authRoutes } from "@/config/site";
import { fetchWeeklyCollection } from "@/lib/collections/client-api";
import { WEEKLY_COLLECTION_PRODUCT_PREVIEW } from "@/lib/collections/defaults";
import { fetchPublicProductsByIds } from "@/lib/products/client-api";

function WeeklyCollectionSkeleton() {
  return (
    <section className="px-6 py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="h-[70vh] max-h-[70vh] animate-pulse rounded-3xl bg-peach/10" />
        <div className="flex flex-col justify-center space-y-4">
          <div className="h-4 w-40 animate-pulse rounded-full bg-peach/10" />
          <div className="h-10 w-3/4 animate-pulse rounded-full bg-peach/10" />
          <div className="h-20 w-full animate-pulse rounded-2xl bg-peach/10" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={`weekly-product-skeleton-${index}`}
                className="h-20 w-20 animate-pulse rounded-2xl bg-peach/10"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function WeeklyCollectionSection() {
  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeeklyCollection()
      .then(async (weeklyCollection) => {
        if (!weeklyCollection) {
          setCollection(null);
          setProducts([]);
          return;
        }

        setCollection(weeklyCollection);

        const previewProducts = await fetchPublicProductsByIds(
          weeklyCollection.productIds,
          WEEKLY_COLLECTION_PRODUCT_PREVIEW
        );

        setProducts(previewProducts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <WeeklyCollectionSkeleton />;
  }

  if (error || !collection) {
    return null;
  }

  const totalCount = collection.productIds.length;
  const collectionHref = authRoutes.collectionDetail(collection.id);

  return (
    <section id="weekly-collection" className="landing-section-weekly px-6 py-14 md:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <Link
          href={collectionHref}
          className="group mx-auto block h-[70vh] max-h-[70vh] w-full overflow-hidden rounded-3xl border border-peach/15 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl lg:mx-0"
        >
          <ProductImage
            src={collection.imagePortrait || collection.imageSquare}
            alt={collection.title}
            aspectRatio="2/3"
            className="!aspect-auto h-full w-full rounded-3xl"
            imageClassName="transition duration-500 group-hover:scale-105"
            priority
          />
        </Link>

        <div className="flex flex-col justify-center">
          <p className="mb-2 font-body text-sm font-bold uppercase tracking-widest text-lavender">
            Collection of the week
          </p>
          <h2 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
            {collection.title}
          </h2>

          {collection.description ? (
            <p className="mt-4 line-clamp-6 font-body text-base leading-relaxed text-charcoal/70 md:text-lg">
              {collection.description}
            </p>
          ) : null}

          <CollectionProductPreviewStrip
            products={products}
            totalCount={totalCount}
            previewLimit={WEEKLY_COLLECTION_PRODUCT_PREVIEW}
            collectionId={collection.id}
            className="mt-8"
          />

          <LandingSectionFooterLink href={collectionHref} align="left" className="mt-0 md:mt-0">
            View collection
          </LandingSectionFooterLink>
        </div>
      </div>
    </section>
  );
}
