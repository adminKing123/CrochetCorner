import { Suspense } from "react";
import { redirect } from "next/navigation";
import UploadsPage from "@/components/admin/uploads/UploadsPage";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";
import { isGithubUploadConfigured } from "@/lib/uploads/github";

export default function AdminUploadsRoutePage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  if (!isGithubUploadConfigured()) {
    redirect(authRoutes.admin);
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <p className="font-body text-charcoal/70">Loading uploads...</p>
        </div>
      }
    >
      <UploadsPage />
    </Suspense>
  );
}
