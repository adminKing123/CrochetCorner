"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import CustomOrderStatusBadge from "@/components/custom-orders/CustomOrderStatusBadge";
import CustomOrderProductReferences from "@/components/custom-orders/CustomOrderProductReferences";
import Pagination from "@/components/shared/Pagination";
import Spinner from "@/components/shared/Spinner";
import { AuthError } from "@/components/auth/ui";
import { authRoutes } from "@/config/site";
import { useAuthUser } from "@/hooks/useAuthUser";
import { fetchMyCustomOrders } from "@/lib/custom-orders/client-api";
import { CUSTOM_ORDERS_PAGE_SIZE } from "@/lib/custom-orders/defaults";

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function MyCustomOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email, loading: authLoading } = useAuthUser();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const page = Number(searchParams.get("page") || 1);

  const loadOrders = useCallback(async () => {
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchMyCustomOrders(email, { page, limit: CUSTOM_ORDERS_PAGE_SIZE });
      setOrders(data.orders || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, page]);

  useEffect(() => {
    if (authLoading) return;
    loadOrders();
  }, [authLoading, loadOrders]);

  return (
    <AuthGuard>
      <div className="landing-hero min-h-screen px-6 py-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 font-body text-sm font-bold uppercase tracking-widest text-peach">
                My requests
              </p>
              <h1 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
                Custom order requests
              </h1>
              <p className="mt-2 font-body text-sm text-charcoal/70">
                Track the status of requests you&apos;ve submitted.
              </p>
            </div>

            <Link
              href={authRoutes.customOrders}
              className="inline-flex rounded-full bg-mint px-5 py-3 font-body text-sm font-bold text-white transition hover:bg-mint-dark"
            >
              New request
            </Link>
          </div>

          {error ? (
            <div className="mb-6">
              <AuthError message={error} />
            </div>
          ) : null}

          <div className="mb-4 flex items-center gap-2">
            {loading ? <Spinner className="h-4 w-4 text-mint" label="Loading requests" /> : null}
            <p className="font-body text-sm text-charcoal/60">
              {loading
                ? "Loading requests..."
                : `${pagination?.total || 0} request${pagination?.total === 1 ? "" : "s"}`}
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={`custom-order-skeleton-${index}`}
                  className="h-36 animate-pulse rounded-3xl border border-peach/10 bg-white"
                />
              ))}
            </div>
          ) : orders.length ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <article
                  key={order.id}
                  className="rounded-3xl border border-peach/15 bg-white p-5 shadow-sm md:p-6"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <CustomOrderStatusBadge status={order.status} />
                    <p className="font-body text-xs text-charcoal/50">
                      Submitted {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-charcoal/80 md:text-base">
                    {order.details}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-charcoal/60">
                    {order.mobile ? (
                      <p>
                        Mobile: <span className="font-semibold text-charcoal">{order.mobile}</span>
                      </p>
                    ) : null}
                  </div>

                  <CustomOrderProductReferences
                    productIds={order.productIds}
                    className="mt-5"
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-peach/20 bg-white px-6 py-16 text-center">
              <p className="font-body text-charcoal/70">You haven&apos;t submitted any requests yet.</p>
              <Link
                href={authRoutes.customOrders}
                className="mt-4 inline-flex font-body text-sm font-semibold text-mint transition hover:text-mint-dark"
              >
                Submit your first custom order →
              </Link>
            </div>
          )}

          <div className="mt-8">
            <Pagination
              pagination={pagination}
              onPageChange={(nextPage) =>
                router.push(
                  `${authRoutes.myCustomOrders}${nextPage > 1 ? `?page=${nextPage}` : ""}`
                )
              }
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
