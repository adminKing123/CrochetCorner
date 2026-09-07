"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseIdList } from "@/lib/products/filters";

export function useShopQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      page: Number(searchParams.get("page") || 1),
      search: searchParams.get("search") || "",
      category: parseIdList(searchParams.get("category")),
      keys: parseIdList(searchParams.get("keys")),
      bestSeller: searchParams.get("bestSeller") || "",
    }),
    [searchParams]
  );

  const setFilters = useCallback(
    (next) => {
      const params = new URLSearchParams();

      if (next.search?.trim()) params.set("search", next.search.trim());
      if (next.category?.length) params.set("category", next.category.join(","));
      if (next.keys?.length) params.set("keys", next.keys.join(","));
      if (next.bestSeller) params.set("bestSeller", next.bestSeller);
      if (next.page && next.page > 1) params.set("page", String(next.page));

      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`);
    },
    [pathname, router]
  );

  return { filters, setFilters };
}
