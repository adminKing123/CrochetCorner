"use client";

import { useEffect, useState } from "react";
import CollectionGrid from "@/components/collections/CollectionGrid";
import LandingSection, { LandingSectionFooterLink } from "@/components/landing/LandingSection";
import { authRoutes } from "@/config/site";
import { fetchTrendingCollections } from "@/lib/collections/client-api";
import { TRENDING_COLLECTIONS_LIMIT } from "@/lib/collections/defaults";

export default function TrendingCollectionsSection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrendingCollections(TRENDING_COLLECTIONS_LIMIT)
      .then(setCollections)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && !error && collections.length === 0) {
    return null;
  }

  return (
    <LandingSection
      id="trending-collections"
      align="center"
      eyebrowTone="mint"
      eyebrow="Curated sets"
      title="Trending collections"
      description="Swipe through themed edits — each one groups pieces by mood, season, or stitch style."
      className="landing-section-collections"
    >
      {error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
          Could not load trending collections. Please try again later.
        </p>
      ) : null}

      <CollectionGrid
        collections={collections}
        loading={loading}
        skeletonCount={TRENDING_COLLECTIONS_LIMIT}
        emptyMessage="No trending collections yet."
        layout="scroll"
        cardVariant="overlay"
      />

      {!loading && !error && collections.length > 0 ? (
        <LandingSectionFooterLink href={authRoutes.collections}>
          Browse all collections
        </LandingSectionFooterLink>
      ) : null}
    </LandingSection>
  );
}
