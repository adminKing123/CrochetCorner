import { redirect } from "next/navigation";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";
import AdminPageClient from "@/components/admin/AdminPageClient";

export default function AdminPage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  return <AdminPageClient />;
}
