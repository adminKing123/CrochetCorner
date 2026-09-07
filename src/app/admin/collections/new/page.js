import { redirect } from "next/navigation";
import CollectionCreatePage from "@/components/admin/collections/CollectionCreatePage";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default function AdminCollectionNewPage() {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  return <CollectionCreatePage />;
}
