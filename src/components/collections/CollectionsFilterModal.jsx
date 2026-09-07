"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function CollectionsFilterModal({ open, onClose, filters, onApply }) {
  const [draftTrending, setDraftTrending] = useState("");
  const [draftWeekly, setDraftWeekly] = useState("");

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

    setDraftTrending(filters.trending);
    setDraftWeekly(filters.weekly);
  }, [open, filters.trending, filters.weekly]);

  if (!open) return null;

  function handleApply() {
    onApply({
      trending: draftTrending,
      weekly: draftWeekly,
    });
    onClose();
  }

  function handleClearDraft() {
    setDraftTrending("");
    setDraftWeekly("");
  }

  const hasDraftFilters = draftTrending !== "" || draftWeekly !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-charcoal/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="collections-filter-title"
        className="w-full max-w-lg overflow-hidden rounded-3xl bg-cream shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-peach/15 px-5 py-4">
          <h2 id="collections-filter-title" className="font-display text-xl font-bold text-charcoal">
            Filter collections
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-charcoal/70 transition hover:bg-peach/10 hover:text-charcoal"
            aria-label="Close filters"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-5 py-5">
          <label className="block">
            <span className="mb-2 block font-body text-sm font-semibold text-charcoal">
              Trending
            </span>
            <select
              value={draftTrending}
              onChange={(event) => setDraftTrending(event.target.value)}
              className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-mint focus:ring-4 focus:ring-mint/15"
            >
              <option value="">All collections</option>
              <option value="true">Trending only</option>
              <option value="false">Non trending</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block font-body text-sm font-semibold text-charcoal">
              Weekly collection
            </span>
            <select
              value={draftWeekly}
              onChange={(event) => setDraftWeekly(event.target.value)}
              className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-mint focus:ring-4 focus:ring-mint/15"
            >
              <option value="">All collections</option>
              <option value="true">Weekly collection only</option>
              <option value="false">Exclude weekly collection</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-peach/15 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClearDraft}
            disabled={!hasDraftFilters}
            className="rounded-2xl border border-peach/25 px-5 py-3 font-body text-sm font-semibold text-charcoal transition hover:bg-peach/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear filters
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="rounded-2xl bg-mint px-5 py-3 font-body text-sm font-bold text-white transition hover:bg-mint-dark"
          >
            Apply filters
          </button>
        </div>
      </div>
    </div>
  );
}
