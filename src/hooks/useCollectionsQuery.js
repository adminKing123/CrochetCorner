"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useCollectionsQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      search: searchParams.get("search") || "",
      trending: searchParams.get("trending") || "",
      weekly: searchParams.get("weekly") || "",
    }),
    [searchParams]
  );

  const setFilters = useCallback(
    (next) => {
      const params = new URLSearchParams();

      if (next.search?.trim()) params.set("search", next.search.trim());
      if (next.trending) params.set("trending", next.trending);
      if (next.weekly) params.set("weekly", next.weekly);
      if (next.page && next.page > 1) params.set("page", String(next.page));

      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`);
    },
    [pathname, router]
  );

  return { filters, setFilters };
}

export function useCollectionDetailQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      search: searchParams.get("search") || "",
    }),
    [searchParams]
  );

  const setFilters = useCallback(
    (next) => {
      const params = new URLSearchParams();

      if (next.search?.trim()) params.set("search", next.search.trim());
      if (next.page && next.page > 1) params.set("page", String(next.page));

      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`);
    },
    [pathname, router]
  );

  return { filters, setFilters };
}
