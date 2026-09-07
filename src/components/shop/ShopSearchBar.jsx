"use client";

import { IoOptionsOutline, IoSearchOutline } from "react-icons/io5";
import Spinner from "@/components/shared/Spinner";

export default function ShopSearchBar({
  search,
  onSearchChange,
  onFilterClick,
  activeFilterCount = 0,
  isSearching = false,
  className = "",
}) {
  return (
    <div className={`mx-auto flex max-w-4xl gap-3 ${className}`}>
      <div className="relative min-w-0 flex-1">
        <label htmlFor="shop-search" className="sr-only">
          Search products
        </label>
        <IoSearchOutline
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40"
          aria-hidden="true"
        />
        <input
          id="shop-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border-2 border-peach/20 bg-white py-3 pl-11 pr-11 font-body text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
        />
        {isSearching ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <Spinner className="h-5 w-5 text-mint" label="Searching products" />
          </span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onFilterClick}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-peach/20 bg-white px-5 py-3 font-body text-sm font-semibold text-charcoal transition hover:border-peach/40 hover:bg-peach/5"
      >
        <IoOptionsOutline className="h-5 w-5" aria-hidden="true" />
        <span className="hidden sm:inline">Filters</span>
        {activeFilterCount > 0 ? (
          <span className="rounded-full bg-mint px-2 py-0.5 text-xs font-bold text-white">
            {activeFilterCount}
          </span>
        ) : null}
      </button>
    </div>
  );
}
