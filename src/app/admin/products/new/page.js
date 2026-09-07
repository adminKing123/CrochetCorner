import { redirect } from "next/navigation";
import ProductCreatePage from "@/components/admin/products/ProductCreatePage";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default function AdminProductNewPage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  return <ProductCreatePage />;
}
