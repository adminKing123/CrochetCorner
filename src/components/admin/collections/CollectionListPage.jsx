"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "@/components/auth/ui";
import { adminRoutes } from "@/config/site";
import { useAdminUser } from "@/hooks/useAdminUser";
import { deleteCollection, fetchCollectionsAdmin } from "@/lib/collections/client-api";

export default function CollectionListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email, loading: authLoading } = useAdminUser();

  const [collections, setCollections] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const trending = searchParams.get("trending") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [trendingFilter, setTrendingFilter] = useState(trending);

  const loadCollections = useCallback(async () => {
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchCollectionsAdmin(email, { page, search, trending });
      setCollections(data.collections);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, page, search, trending]);

  useEffect(() => {
    if (authLoading) return;
    loadCollections();
  }, [authLoading, loadCollections]);

  function updateQuery(next) {
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.trending) params.set("trending", next.trending);
    if (next.page && next.page > 1) params.set("page", String(next.page));

    const query = params.toString();
    router.push(`${adminRoutes.collections}${query ? `?${query}` : ""}`);
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;

    setError("");
    setSuccess("");

    try {
      await deleteCollection(email, id);
      setSuccess("Collection deleted.");
      loadCollections();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminShell
      title="Collections"
      description="Create curated groups of products for your storefront."
    >
      <div className="mb-6">
        <Link
          href={adminRoutes.collectionNew}
          className="inline-flex rounded-2xl bg-peach px-5 py-3.5 font-body text-sm font-bold text-white shadow-md transition hover:bg-peach-dark"
        >
          + Add collection
        </Link>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateQuery({ search: searchInput.trim(), trending: trendingFilter, page: 1 });
        }}
        className="mb-6 grid gap-4 rounded-2xl border border-peach/20 bg-white p-4 md:grid-cols-[1fr_auto_auto]"
      >
        <AuthInput
          label="Search"
          id="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by title or description..."
        />
        <label className="block">
          <span className="mb-2 block font-body text-sm font-semibold text-charcoal">
            Trending
          </span>
          <select
            value={trendingFilter}
            onChange={(event) => setTrendingFilter(event.target.value)}
            className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-mint focus:ring-4 focus:ring-mint/15"
          >
            <option value="">All collections</option>
            <option value="true">Trending only</option>
            <option value="false">Non trending</option>
          </select>
        </label>
        <div className="flex items-end">
          <AuthButton type="submit">Apply filters</AuthButton>
        </div>
      </form>

      <AuthError message={error} />
      <AuthSuccess message={success} />

      {loading ? (
        <p className="font-body text-charcoal/70">Loading collections...</p>
      ) : collections.length === 0 ? (
        <div className="rounded-2xl border border-peach/20 bg-white p-8 text-center">
          <p className="font-body text-charcoal/70">No collections found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {collections.map((collection) => (
            <article
              key={collection.id}
              className="grid gap-4 rounded-2xl border border-peach/20 bg-white p-4 shadow-sm md:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-peach/5">
                {collection.imageSquare ? (
                  <img
                    src={collection.imageSquare}
                    alt={collection.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-charcoal">
                    {collection.title}
                  </h3>
                  {collection.isTrending ? (
                    <span className="rounded-full bg-peach/15 px-3 py-1 font-body text-xs font-semibold text-peach-dark">
                      Trending
                    </span>
                  ) : null}
                </div>
                {collection.description ? (
                  <p className="mt-2 line-clamp-2 font-body text-sm text-charcoal/70">
                    {collection.description}
                  </p>
                ) : null}
                <p className="mt-2 font-body text-sm text-charcoal/60">
                  {collection.productIds.length} product
                  {collection.productIds.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex items-start gap-2 md:flex-col md:items-stretch">
                <Link
                  href={adminRoutes.collectionEdit(collection.id)}
                  className="rounded-xl border border-peach/25 px-4 py-2 text-center font-body text-sm font-semibold text-charcoal transition hover:bg-peach/10"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(collection.id, collection.title)}
                  className="rounded-xl border border-red-200 px-4 py-2 font-body text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6">
        <AdminPagination
          pagination={pagination}
          onPageChange={(nextPage) =>
            updateQuery({ search, trending, page: nextPage })
          }
        />
      </div>
    </AdminShell>
  );
}
