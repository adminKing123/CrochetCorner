"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import CollectionGrid from "@/components/collections/CollectionGrid";
import CollectionsFilterModal from "@/components/collections/CollectionsFilterModal";
import Pagination from "@/components/shared/Pagination";
import Spinner from "@/components/shared/Spinner";
import ShopSearchBar from "@/components/shop/ShopSearchBar";
import { useCollectionsQuery } from "@/hooks/useCollectionsQuery";
import { fetchCollections } from "@/lib/collections/client-api";
import {
  COLLECTIONS_SEARCH_DEBOUNCE_MS,
  COLLECTIONS_SHOP_PAGE_SIZE,
} from "@/lib/collections/defaults";

export default function CollectionsPage() {
  const { filters, setFilters } = useCollectionsQuery();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [collections, setCollections] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const filtersRef = useRef(filters);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const debouncedApplySearch = useDebouncedCallback((search) => {
    setFilters({ ...filtersRef.current, page: 1, search });
  }, COLLECTIONS_SEARCH_DEBOUNCE_MS);

  const loadCollections = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchCollections({
        page: filters.page,
        limit: COLLECTIONS_SHOP_PAGE_SIZE,
        search: filters.search,
        trending: filters.trending,
        weekly: filters.weekly,
      });

      setCollections(data.collections || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  function handleSearchChange(search) {
    setSearchInput(search);
    debouncedApplySearch(search);
  }

  function handleApplyFilters({ trending, weekly }) {
    setFilters({
      ...filters,
      page: 1,
      trending,
      weekly,
    });
  }

  const isSearchPending = searchInput.trim() !== filters.search.trim();
  const isSearching =
    isSearchPending ||
    (loading && !isSearchPending && searchInput.trim() === filters.search.trim());

  const activeFilterCount =
    (filters.trending ? 1 : 0) + (filters.weekly ? 1 : 0);

  return (
    <div className="landing-hero min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
        <header className="mb-8 max-w-2xl">
          <p className="mb-2 font-body text-sm font-bold uppercase tracking-widest text-peach">
            Browse themes
          </p>
          <h1 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
            Collections
          </h1>
          <p className="mt-3 font-body text-base leading-relaxed text-charcoal/70 md:text-lg">
            Explore curated sets of crochet pieces grouped by mood, season, or style.
          </p>
        </header>

        <ShopSearchBar
          search={searchInput}
          onSearchChange={handleSearchChange}
          onFilterClick={() => setFilterModalOpen(true)}
          activeFilterCount={activeFilterCount}
          isSearching={isSearching}
          placeholder="Search collections..."
          searchLabel="Search collections"
          spinnerLabel="Searching collections"
          className="mb-8"
        />

        <CollectionsFilterModal
          open={filterModalOpen}
          onClose={() => setFilterModalOpen(false)}
          filters={filters}
          onApply={handleApplyFilters}
        />

        <div className="mb-6 flex items-center gap-2">
          {loading && !isSearchPending ? (
            <Spinner className="h-4 w-4 text-mint" label="Loading collections" />
          ) : null}
          <p className="font-body text-sm text-charcoal/60">
            {loading
              ? isSearchPending
                ? "Searching..."
                : "Loading collections..."
              : `${pagination?.total || 0} collection${pagination?.total === 1 ? "" : "s"}`}
          </p>
        </div>

        {error ? (
          <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <CollectionGrid
          collections={collections}
          loading={loading}
          skeletonCount={COLLECTIONS_SHOP_PAGE_SIZE}
          emptyMessage="No collections match your filters. Try adjusting your search or filters."
          cardVariant="landscape"
          showBadges
        />

        <div className="mt-8">
          <Pagination
            pagination={pagination}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </div>
    </div>
  );
}
