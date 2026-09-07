"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import CollectionForm from "@/components/admin/collections/CollectionForm";
import { AuthSuccess } from "@/components/auth/ui";
import { adminRoutes } from "@/config/site";
import { useAdminUser } from "@/hooks/useAdminUser";
import { fetchCollectionAdmin, updateCollection } from "@/lib/collections/client-api";
import { fetchProductsByIds } from "@/lib/products/client-api";

export default function CollectionEditPage({ collectionId }) {
  const router = useRouter();
  const { email } = useAdminUser();
  const [collection, setCollection] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCollection() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchCollectionAdmin(email, collectionId);
        const loadedCollection = data.collection;
        setCollection(loadedCollection);

        if (loadedCollection.productIds?.length) {
          const productsData = await fetchProductsByIds(email, loadedCollection.productIds);
          const productsById = new Map(
            (productsData.items || []).map((product) => [product.id, product])
          );
          setSelectedProducts(
            loadedCollection.productIds
              .map((id) => productsById.get(id))
              .filter(Boolean)
          );
        } else {
          setSelectedProducts([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (email) {
      loadCollection();
    }
  }, [collectionId, email]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateCollection(email, collectionId, {
        ...collection,
        productIds: selectedProducts.map((product) => product.id),
      });
      setSuccess("Collection updated.");
      setTimeout(() => router.push(adminRoutes.collections), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Edit collection" description="Update collection details and products.">
      {loading ? (
        <p className="font-body text-charcoal/70">Loading collection...</p>
      ) : collection ? (
        <>
          <AuthSuccess message={success} />
          <CollectionForm
            collection={collection}
            selectedProducts={selectedProducts}
            onChange={setCollection}
            onProductsChange={setSelectedProducts}
            onSubmit={handleSubmit}
            submitLabel="Update collection"
            loading={saving}
            error={error}
            adminEmail={email}
          />
        </>
      ) : (
        <p className="font-body text-red-600">{error || "Collection not found."}</p>
      )}
    </AdminShell>
  );
}
