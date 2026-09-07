import { redirect } from "next/navigation";
import { adminRoutes, authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default function AdminIndexPage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  redirect(adminRoutes.heroCarousel);
}
