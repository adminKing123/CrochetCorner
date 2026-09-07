"use client";

import { useCallback, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import SearchableMultiSelect from "@/components/shared/SearchableMultiSelect";
import { categoriesApi, keysApi } from "@/lib/taxonomy/client-api";

export default function ShopFilterModal({
  open,
  onClose,
  filters,
  onApply,
}) {
  const [draftCategories, setDraftCategories] = useState([]);
  const [draftKeys, setDraftKeys] = useState([]);
  const [draftBestSeller, setDraftBestSeller] = useState("");

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    setDraftBestSeller(filters.bestSeller);

    async function loadDraftItems() {
      try {
        const [categoriesData, keysData] = await Promise.all([
          filters.category.length
            ? categoriesApi.search({ ids: filters.category.join(",") })
            : Promise.resolve({ items: [] }),
          filters.keys.length
            ? keysApi.search({ ids: filters.keys.join(",") })
            : Promise.resolve({ items: [] }),
        ]);

        setDraftCategories(categoriesData.items || []);
        setDraftKeys(keysData.items || []);
      } catch {
        setDraftCategories([]);
        setDraftKeys([]);
      }
    }

    loadDraftItems();
  }, [open, filters.bestSeller, filters.category, filters.keys]);

  const searchCategories = useCallback((search) => categoriesApi.search({ search }), []);
  const searchKeys = useCallback((search) => keysApi.search({ search }), []);

  if (!open) return null;

  function handleApply() {
    onApply({
      category: draftCategories.map((item) => item.id),
      keys: draftKeys.map((item) => item.id),
      bestSeller: draftBestSeller,
    });
    onClose();
  }

  function handleClearDraft() {
    setDraftCategories([]);
    setDraftKeys([]);
    setDraftBestSeller("");
  }

  const hasDraftFilters =
    draftCategories.length > 0 || draftKeys.length > 0 || draftBestSeller === "true";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-filter-title"
        className="relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border border-peach/20 bg-cream shadow-2xl sm:max-w-lg sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-peach/15 bg-cream/95 px-5 py-4 backdrop-blur-sm">
          <h2
            id="shop-filter-title"
            className="font-display text-xl font-bold text-charcoal"
          >
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-charcoal/70 transition hover:bg-peach/10 hover:text-charcoal"
          >
            <IoClose className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <SearchableMultiSelect
            label="Categories"
            placeholder="Search categories..."
            selectedItems={draftCategories}
            onChange={setDraftCategories}
            onSearch={searchCategories}
            emptyMessage="No categories found."
          />

          <SearchableMultiSelect
            label="Keys"
            placeholder="Search keys..."
            selectedItems={draftKeys}
            onChange={setDraftKeys}
            onSearch={searchKeys}
            emptyMessage="No keys found."
          />

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-peach/20 bg-white px-4 py-3 font-body text-sm font-semibold text-charcoal">
            <input
              type="checkbox"
              checked={draftBestSeller === "true"}
              onChange={(event) =>
                setDraftBestSeller(event.target.checked ? "true" : "")
              }
              className="h-4 w-4 accent-mint"
            />
            Best sellers only
          </label>

          <div className="flex gap-3 border-t border-peach/10 pt-5">
            {hasDraftFilters ? (
              <button
                type="button"
                onClick={handleClearDraft}
                className="flex-1 rounded-2xl border border-peach/25 px-4 py-3 font-body text-sm font-semibold text-charcoal transition hover:bg-peach/10"
              >
                Clear filters
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-2xl bg-mint px-4 py-3 font-body text-sm font-bold text-white transition hover:bg-mint-dark"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
