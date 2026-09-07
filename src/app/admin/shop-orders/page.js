import { Suspense } from "react";
import { redirect } from "next/navigation";
import AdminShopOrderListPage from "@/components/admin/shop-orders/AdminShopOrderListPage";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default function AdminShopOrdersPage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <p className="font-body text-charcoal/70">Loading shop orders...</p>
        </div>
      }
    >
      <AdminShopOrderListPage />
    </Suspense>
  );
}
