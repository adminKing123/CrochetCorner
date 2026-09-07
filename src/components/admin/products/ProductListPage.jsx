"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "@/components/auth/ui";
import { adminRoutes } from "@/config/site";
import { useAdminUser } from "@/hooks/useAdminUser";
import { deleteProduct, fetchProducts } from "@/lib/products/client-api";
import { formatCurrency } from "@/lib/products/format";

export default function ProductListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email } = useAdminUser();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const bestSeller = searchParams.get("bestSeller") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [bestSellerFilter, setBestSellerFilter] = useState(bestSeller);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchProducts({ page, search, bestSeller });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bestSeller, page, search]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function updateQuery(next) {
    const params = new URLSearchParams();

    if (next.search) params.set("search", next.search);
    if (next.bestSeller) params.set("bestSeller", next.bestSeller);
    if (next.page && next.page > 1) params.set("page", String(next.page));

    const query = params.toString();
    router.push(`${adminRoutes.products}${query ? `?${query}` : ""}`);
  }

  function handleFilterSubmit(event) {
    event.preventDefault();
    updateQuery({ search: searchInput.trim(), bestSeller: bestSellerFilter, page: 1 });
  }

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"?`)) return;

    setError("");
    setSuccess("");

    try {
      await deleteProduct(email, id);
      setSuccess("Product deleted.");
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AdminShell
      title="Products"
      description="Manage product listings, pricing, and best seller flags."
    >
      <div className="mb-6">
        <Link
          href={adminRoutes.productNew}
          className="inline-flex rounded-2xl bg-peach px-5 py-3.5 font-body text-sm font-bold text-white shadow-md transition hover:bg-peach-dark"
        >
          + Add product
        </Link>
      </div>

      <form
        onSubmit={handleFilterSubmit}
        className="mb-6 grid gap-4 rounded-2xl border border-peach/20 bg-white p-4 md:grid-cols-[1fr_auto_auto]"
      >
        <AuthInput
          label="Search"
          id="search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by title..."
        />
        <label className="block">
          <span className="mb-2 block font-body text-sm font-semibold text-charcoal">
            Best seller
          </span>
          <select
            value={bestSellerFilter}
            onChange={(event) => setBestSellerFilter(event.target.value)}
            className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-mint focus:ring-4 focus:ring-mint/15"
          >
            <option value="">All products</option>
            <option value="true">Best sellers only</option>
            <option value="false">Non best sellers</option>
          </select>
        </label>
        <div className="flex items-end">
          <AuthButton type="submit">Apply filters</AuthButton>
        </div>
      </form>

      <AuthError message={error} />
      <AuthSuccess message={success} />

      {loading ? (
        <p className="font-body text-charcoal/70">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-peach/20 bg-white p-8 text-center">
          <p className="font-body text-charcoal/70">No products found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="grid gap-4 rounded-2xl border border-peach/20 bg-white p-4 shadow-sm md:grid-cols-[120px_1fr_auto]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-peach/5">
                {product.imageSquare ? (
                  <img
                    src={product.imageSquare}
                    alt={product.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-xl font-bold text-charcoal">
                    {product.title}
                  </h3>
                  {product.isBestSeller ? (
                    <span className="rounded-full bg-mint/10 px-3 py-1 font-body text-xs font-semibold text-mint">
                      Best seller
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 font-body text-sm text-charcoal/70">
                  Original: {formatCurrency(product.originalPrice)} · Sell:{" "}
                  {formatCurrency(product.sellingPrice)}
                </p>
              </div>

              <div className="flex items-start gap-2 md:flex-col md:items-stretch">
                <Link
                  href={adminRoutes.productEdit(product.id)}
                  className="rounded-xl border border-peach/25 px-4 py-2 text-center font-body text-sm font-semibold text-charcoal transition hover:bg-peach/10"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(product.id, product.title)}
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
            updateQuery({ search, bestSeller, page: nextPage })
          }
        />
      </div>
    </AdminShell>
  );
}
