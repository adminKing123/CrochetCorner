import { Suspense } from "react";
import { redirect } from "next/navigation";
import AdminCustomOrderListPage from "@/components/admin/custom-orders/AdminCustomOrderListPage";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default function AdminCustomOrdersPage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <p className="font-body text-charcoal/70">Loading custom orders...</p>
        </div>
      }
    >
      <AdminCustomOrderListPage />
    </Suspense>
  );
}
