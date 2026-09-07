"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import CollectionDetailHero from "@/components/collections/CollectionDetailHero";
import Pagination from "@/components/shared/Pagination";
import Spinner from "@/components/shared/Spinner";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductQuickViewProvider } from "@/components/products/ProductQuickViewProvider";
import ShopSearchBar from "@/components/shop/ShopSearchBar";
import { authRoutes } from "@/config/site";
import { useCollectionDetailQuery } from "@/hooks/useCollectionsQuery";
import { fetchCollectionProducts } from "@/lib/collections/client-api";
import {
  COLLECTION_DETAIL_PRODUCTS_PAGE_SIZE,
  COLLECTIONS_SEARCH_DEBOUNCE_MS,
} from "@/lib/collections/defaults";

export default function CollectionDetailPage({ collectionId }) {
  const { filters, setFilters } = useCollectionDetailQuery();

  const [collection, setCollection] = useState(null);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
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

  const loadCollectionProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotFound(false);

    try {
      const data = await fetchCollectionProducts(collectionId, {
        page: filters.page,
        limit: COLLECTION_DETAIL_PRODUCTS_PAGE_SIZE,
        search: filters.search,
      });

      setCollection(data.collection);
      setProducts(data.products || []);
      setPagination(data.pagination || null);
    } catch (err) {
      if (err.message?.toLowerCase().includes("not found")) {
        setNotFound(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [collectionId, filters]);

  useEffect(() => {
    loadCollectionProducts();
  }, [loadCollectionProducts]);

  function handleSearchChange(search) {
    setSearchInput(search);
    debouncedApplySearch(search);
  }

  const isSearchPending = searchInput.trim() !== filters.search.trim();
  const isSearching =
    isSearchPending ||
    (loading && !isSearchPending && searchInput.trim() === filters.search.trim());

  if (notFound) {
    return (
      <div className="landing-hero flex min-h-[50vh] items-center justify-center px-6 py-16">
        <div className="max-w-md rounded-3xl border border-peach/20 bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-2xl font-bold text-charcoal">Collection not found</h1>
          <p className="mt-3 font-body text-charcoal/70">
            This collection may have been removed or the link is incorrect.
          </p>
          <Link
            href={authRoutes.collections}
            className="mt-6 inline-flex rounded-full bg-mint px-6 py-3 font-body text-sm font-bold text-white transition hover:bg-mint-dark"
          >
            Back to collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProductQuickViewProvider>
      <div className="landing-hero min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
          <Link
            href={authRoutes.collections}
            className="mb-6 inline-flex font-body text-sm font-semibold text-mint transition hover:text-mint-dark"
          >
            ← Back to collections
          </Link>

          {collection ? <CollectionDetailHero collection={collection} /> : null}

          <section className="mt-10 md:mt-12">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-charcoal md:text-3xl">
                  Products in this collection
                </h2>
                <p className="mt-2 font-body text-sm text-charcoal/60">
                  Search and browse items included in this curated set.
                </p>
              </div>

              <ShopSearchBar
                search={searchInput}
                onSearchChange={handleSearchChange}
                isSearching={isSearching}
                placeholder="Search products in collection..."
                searchLabel="Search products in collection"
                spinnerLabel="Searching products"
                showFilters={false}
                className="w-full md:max-w-md"
              />
            </div>

            <div className="mb-6 flex items-center gap-2">
              {loading && !isSearchPending ? (
                <Spinner className="h-4 w-4 text-mint" label="Loading products" />
              ) : null}
              <p className="font-body text-sm text-charcoal/60">
                {loading
                  ? isSearchPending
                    ? "Searching..."
                    : "Loading products..."
                  : `${pagination?.total || 0} product${pagination?.total === 1 ? "" : "s"}`}
              </p>
            </div>

            {error ? (
              <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <ProductGrid
              products={products}
              loading={loading}
              skeletonCount={COLLECTION_DETAIL_PRODUCTS_PAGE_SIZE}
              imageAspectRatio="1/1"
              emptyMessage="No products in this collection match your search."
            />

            <div className="mt-8">
              <Pagination
                pagination={pagination}
                onPageChange={(page) => setFilters({ ...filters, page })}
              />
            </div>
          </section>
        </div>
      </div>
    </ProductQuickViewProvider>
  );
}
