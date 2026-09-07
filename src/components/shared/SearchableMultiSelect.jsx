"use client";

import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function SearchableMultiSelect({
  label,
  placeholder = "Search...",
  selectedItems,
  onChange,
  onSearch,
  emptyMessage = "No results found.",
  menuClassName = "",
  getOptionDescription,
}) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const timer = setTimeout(async () => {
      setLoading(true);

      try {
        const data = await onSearch(query);
        setOptions(data.items || []);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, open, onSearch]);

  function toggleItem(item) {
    const exists = selectedItems.some((selected) => selected.id === item.id);

    if (exists) {
      onChange(selectedItems.filter((selected) => selected.id !== item.id));
      return;
    }

    onChange([...selectedItems, item]);
  }

  function removeItem(id) {
    onChange(selectedItems.filter((item) => item.id !== id));
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block font-body text-sm font-semibold text-charcoal">
        {label}
      </label>

      {selectedItems.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedItems.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center gap-1 rounded-full bg-mint/10 px-3 py-1 font-body text-sm text-mint-dark"
            >
              {item.name}
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="rounded-full p-0.5 hover:bg-mint/20"
                aria-label={`Remove ${item.name}`}
              >
                <IoClose className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
      />

      {open ? (
        <div
          className={`absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-peach/20 bg-white py-2 shadow-lg ${menuClassName}`}
        >
          {loading ? (
            <p className="px-4 py-2 font-body text-sm text-charcoal/60">Searching...</p>
          ) : options.length === 0 ? (
            <p className="px-4 py-2 font-body text-sm text-charcoal/60">{emptyMessage}</p>
          ) : (
            options.map((item) => {
              const checked = selectedItems.some((selected) => selected.id === item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left font-body text-sm transition hover:bg-peach/10 ${
                    checked ? "bg-peach/10 text-mint-dark" : "text-charcoal"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      checked ? "border-mint bg-mint text-white" : "border-peach/30"
                    }`}
                  >
                    {checked ? "✓" : ""}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate">{item.name}</span>
                    {getOptionDescription ? (
                      <span className="block truncate text-xs text-charcoal/50">
                        {getOptionDescription(item)}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
