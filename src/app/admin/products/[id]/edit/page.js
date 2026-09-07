import { redirect } from "next/navigation";
import ProductEditPage from "@/components/admin/products/ProductEditPage";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default async function AdminProductEditRoute({ params }) {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  const { id } = await params;

  return <ProductEditPage productId={id} />;
}
