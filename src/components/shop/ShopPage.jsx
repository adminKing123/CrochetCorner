"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/components/shared/Pagination";
import Spinner from "@/components/shared/Spinner";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductQuickViewProvider } from "@/components/products/ProductQuickViewProvider";
import ShopFilterModal from "@/components/shop/ShopFilterModal";
import ShopSearchBar from "@/components/shop/ShopSearchBar";
import { useShopQuery } from "@/hooks/useShopQuery";
import { SHOP_PRODUCTS_PAGE_SIZE, SHOP_SEARCH_DEBOUNCE_MS } from "@/lib/products/defaults";
import { fetchProducts } from "@/lib/products/client-api";

export default function ShopPage() {
  const { filters, setFilters } = useShopQuery();

  const [searchInput, setSearchInput] = useState(filters.search);
  const [products, setProducts] = useState([]);
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
  }, SHOP_SEARCH_DEBOUNCE_MS);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchProducts({
        page: filters.page,
        limit: SHOP_PRODUCTS_PAGE_SIZE,
        search: filters.search,
        category: filters.category.join(","),
        keys: filters.keys.join(","),
        bestSeller: filters.bestSeller,
      });

      setProducts(data.products || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function handleSearchChange(search) {
    setSearchInput(search);
    debouncedApplySearch(search);
  }

  function handleApplyFilters({ category, keys, bestSeller }) {
    setFilters({
      ...filters,
      page: 1,
      category,
      keys,
      bestSeller,
    });
  }

  const isSearchPending = searchInput.trim() !== filters.search.trim();
  const isSearching =
    isSearchPending ||
    (loading && !isSearchPending && searchInput.trim() === filters.search.trim());

  const activeFilterCount =
    filters.category.length +
    filters.keys.length +
    (filters.bestSeller === "true" ? 1 : 0);

  return (
    <ProductQuickViewProvider>
      <div className="landing-hero min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
          <ShopSearchBar
            search={searchInput}
            onSearchChange={handleSearchChange}
            onFilterClick={() => setFilterModalOpen(true)}
            activeFilterCount={activeFilterCount}
            isSearching={isSearching}
            className="mb-8"
          />

          <ShopFilterModal
            open={filterModalOpen}
            onClose={() => setFilterModalOpen(false)}
            filters={filters}
            onApply={handleApplyFilters}
          />

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
            skeletonCount={SHOP_PRODUCTS_PAGE_SIZE}
            imageAspectRatio="1/1"
            emptyMessage="No products match your filters. Try adjusting your search or filters."
          />

          <div className="mt-8">
            <Pagination
              pagination={pagination}
              onPageChange={(page) => setFilters({ ...filters, page })}
            />
          </div>
        </div>
      </div>
    </ProductQuickViewProvider>
  );
}
