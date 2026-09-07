import { Suspense } from "react";
import { redirect } from "next/navigation";
import ProductListPage from "@/components/admin/products/ProductListPage";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default function AdminProductsPage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <p className="font-body text-charcoal/70">Loading products...</p>
        </div>
      }
    >
      <ProductListPage />
    </Suspense>
  );
}
