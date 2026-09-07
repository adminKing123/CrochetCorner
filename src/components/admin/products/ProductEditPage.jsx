"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/products/ProductForm";
import { AuthSuccess } from "@/components/auth/ui";
import { adminRoutes } from "@/config/site";
import { useAdminUser } from "@/hooks/useAdminUser";
import { fetchProduct, updateProduct } from "@/lib/products/client-api";
import { categoriesApi, keysApi } from "@/lib/taxonomy/client-api";

export default function ProductEditPage({ productId }) {
  const router = useRouter();
  const { email } = useAdminUser();
  const [product, setProduct] = useState(null);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchProduct(productId);
        const loadedProduct = data.product;
        setProduct(loadedProduct);

        const [keysData, categoriesData] = await Promise.all([
          loadedProduct.keyIds?.length
            ? keysApi.search({ ids: loadedProduct.keyIds.join(",") })
            : Promise.resolve({ items: [] }),
          loadedProduct.categoryIds?.length
            ? categoriesApi.search({ ids: loadedProduct.categoryIds.join(",") })
            : Promise.resolve({ items: [] }),
        ]);

        setSelectedKeys(keysData.items || []);
        setSelectedCategories(categoriesData.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProduct(email, productId, {
        ...product,
        keyIds: selectedKeys.map((item) => item.id),
        categoryIds: selectedCategories.map((item) => item.id),
      });
      setSuccess("Product updated.");
      setTimeout(() => router.push(adminRoutes.products), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Edit product" description="Update product details and images.">
      {loading ? (
        <p className="font-body text-charcoal/70">Loading product...</p>
      ) : product ? (
        <>
          <AuthSuccess message={success} />
          <ProductForm
            product={product}
            selectedKeys={selectedKeys}
            selectedCategories={selectedCategories}
            onChange={setProduct}
            onKeysChange={setSelectedKeys}
            onCategoriesChange={setSelectedCategories}
            onSubmit={handleSubmit}
            submitLabel="Update product"
            loading={saving}
            error={error}
          />
        </>
      ) : (
        <p className="font-body text-red-600">{error || "Product not found."}</p>
      )}
    </AdminShell>
  );
}
