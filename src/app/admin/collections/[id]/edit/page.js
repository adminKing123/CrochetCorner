import { redirect } from "next/navigation";
import CollectionEditPage from "@/components/admin/collections/CollectionEditPage";
import { authRoutes } from "@/config/site";
import { isAdminEmailConfigured } from "@/lib/auth/admin";

export default async function AdminCollectionEditPage({ params }) {
  if (!isAdminEmailConfigured()) {
    redirect(authRoutes.home);
  }

  const { id } = await params;

  return <CollectionEditPage collectionId={id} />;
}
