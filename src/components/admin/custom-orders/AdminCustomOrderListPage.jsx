"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminPagination from "@/components/admin/AdminPagination";
import AdminShell from "@/components/admin/AdminShell";
import CustomOrderStatusBadge from "@/components/custom-orders/CustomOrderStatusBadge";
import CustomOrderProductReferences from "@/components/custom-orders/CustomOrderProductReferences";
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "@/components/auth/ui";
import { adminRoutes } from "@/config/site";
import { useAdminUser } from "@/hooks/useAdminUser";
import {
  CUSTOM_ORDER_STATUSES,
  CUSTOM_ORDER_STATUS_LABELS,
} from "@/lib/custom-orders/defaults";
import {
  fetchCustomOrdersAdmin,
  updateCustomOrderStatusAdmin,
} from "@/lib/custom-orders/client-api";

function formatDate(value) {
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminCustomOrderListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { email, loading: authLoading } = useAdminUser();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [statusFilter, setStatusFilter] = useState(status);

  const loadOrders = useCallback(async () => {
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const data = await fetchCustomOrdersAdmin(email, { page, search, status });
      setOrders(data.orders || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, page, search, status]);

  useEffect(() => {
    if (authLoading) return;
    loadOrders();
  }, [authLoading, loadOrders]);

  function updateQuery(next) {
    const params = new URLSearchParams();
    if (next.search) params.set("search", next.search);
    if (next.status) params.set("status", next.status);
    if (next.page && next.page > 1) params.set("page", String(next.page));

    const query = params.toString();
    router.push(`${adminRoutes.customOrders}${query ? `?${query}` : ""}`);
  }

  async function handleStatusChange(orderId, nextStatus) {
    setError("");
    setSuccess("");
    setUpdatingId(orderId);

    try {
      await updateCustomOrderStatusAdmin(email, orderId, nextStatus);
      setSuccess("Order status updated.");
      loadOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <AdminShell
      title="Custom Orders"
      description="Review customer requests and update their status."
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateQuery({ search: searchInput.trim(), status: statusFilter, page: 1 });
        }}
        className="mb-6 grid gap-4 rounded-2xl border border-peach/20 bg-white p-4 md:grid-cols-[1fr_auto_auto]"
      >
        <AuthInput
          label="Search"
          id="custom-order-search"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search by email, name, details, or product..."
        />

        <label className="block">
          <span className="mb-2 block font-body text-sm font-semibold text-charcoal">Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none focus:border-mint focus:ring-4 focus:ring-mint/15"
          >
            <option value="">All statuses</option>
            {CUSTOM_ORDER_STATUSES.map((value) => (
              <option key={value} value={value}>
                {CUSTOM_ORDER_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end">
          <AuthButton type="submit">Apply filters</AuthButton>
        </div>
      </form>

      {error ? (
        <div className="mb-4">
          <AuthError message={error} />
        </div>
      ) : null}
      {success ? (
        <div className="mb-4">
          <AuthSuccess message={success} />
        </div>
      ) : null}

      {loading ? (
        <p className="font-body text-charcoal/70">Loading custom order requests...</p>
      ) : orders.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-peach/20 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <CustomOrderStatusBadge status={order.status} />
                    <p className="font-body text-xs text-charcoal/50">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="font-body text-sm font-semibold text-charcoal">
                    {order.userName || "Customer"}
                  </p>
                  <p className="font-body text-sm text-charcoal/70">{order.userEmail}</p>
                  {order.mobile ? (
                    <p className="font-body text-sm text-charcoal/70">Mobile: {order.mobile}</p>
                  ) : null}
                </div>

                <label className="block min-w-[180px]">
                  <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-wide text-charcoal/60">
                    Update status
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(event) => handleStatusChange(order.id, event.target.value)}
                    className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-2.5 font-body text-sm text-charcoal outline-none focus:border-mint focus:ring-4 focus:ring-mint/15 disabled:opacity-60"
                  >
                    {CUSTOM_ORDER_STATUSES.map((value) => (
                      <option key={value} value={value}>
                        {CUSTOM_ORDER_STATUS_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <p className="whitespace-pre-wrap font-body text-sm leading-relaxed text-charcoal/80">
                {order.details}
              </p>

              <CustomOrderProductReferences productIds={order.productIds} className="mt-5" />
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-peach/20 bg-white px-6 py-12 text-center">
          <p className="font-body text-charcoal/70">No custom order requests found.</p>
        </div>
      )}

      <AdminPagination
        pagination={pagination}
        onPageChange={(nextPage) => updateQuery({ search, status, page: nextPage })}
      />
    </AdminShell>
  );
}
