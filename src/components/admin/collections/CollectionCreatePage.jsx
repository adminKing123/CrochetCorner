"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import CollectionForm from "@/components/admin/collections/CollectionForm";
import { AuthSuccess } from "@/components/auth/ui";
import { adminRoutes } from "@/config/site";
import { useAdminUser } from "@/hooks/useAdminUser";
import { createCollection } from "@/lib/collections/client-api";
import { createEmptyCollection } from "@/lib/collections/validation";

export default function CollectionCreatePage() {
  const router = useRouter();
  const { email } = useAdminUser();
  const [collection, setCollection] = useState(createEmptyCollection());
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createCollection(email, {
        ...collection,
        productIds: selectedProducts.map((product) => product.id),
      });
      setSuccess("Collection created.");
      setTimeout(() => router.push(adminRoutes.collections), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell title="Add collection" description="Create a new product collection.">
      <AuthSuccess message={success} />
      <CollectionForm
        collection={collection}
        selectedProducts={selectedProducts}
        onChange={setCollection}
        onProductsChange={setSelectedProducts}
        onSubmit={handleSubmit}
        submitLabel="Create collection"
        loading={loading}
        error={error}
        adminEmail={email}
      />
    </AdminShell>
  );
}
