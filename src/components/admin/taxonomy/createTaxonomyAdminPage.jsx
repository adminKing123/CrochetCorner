import { Suspense } from "react";
import { redirect } from "next/navigation";
import TaxonomyManagerPage from "@/components/admin/taxonomy/TaxonomyManagerPage";
import { adminRoutes, authRoutes, taxonomyAdminConfig } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

function TaxonomyPage({ type }) {
  const config = taxonomyAdminConfig[type];

  if (!config) {
    redirect(adminRoutes.root);
  }

  return <TaxonomyManagerPage config={{ ...config, type }} />;
}

export function createTaxonomyAdminPage(type) {
  return function Page() {
    if (!isAdminEmailConfigured()) {
      redirect(authRoutes.home);
    }

    return (
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-cream">
            <p className="font-body text-charcoal/70">Loading...</p>
          </div>
        }
      >
        <TaxonomyPage type={type} />
      </Suspense>
    );
  };
}
