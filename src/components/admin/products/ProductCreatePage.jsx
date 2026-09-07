"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ProductForm from "@/components/admin/products/ProductForm";
import { AuthSuccess } from "@/components/auth/ui";
import { adminRoutes } from "@/config/site";
import { useAdminUser } from "@/hooks/useAdminUser";
import { createProduct } from "@/lib/products/client-api";
import { createEmptyProduct } from "@/lib/products/validation";

export default function ProductCreatePage() {
  const router = useRouter();
  const { email } = useAdminUser();
  const [product, setProduct] = useState(createEmptyProduct());
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await createProduct(email, {
        ...product,
        keyIds: selectedKeys.map((item) => item.id),
        categoryIds: selectedCategories.map((item) => item.id),
      });
      setSuccess("Product created.");
      setTimeout(() => router.push(adminRoutes.products), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell title="Add product" description="Create a new product listing.">
      <AuthSuccess message={success} />
      <ProductForm
        product={product}
        selectedKeys={selectedKeys}
        selectedCategories={selectedCategories}
        onChange={setProduct}
        onKeysChange={setSelectedKeys}
        onCategoriesChange={setSelectedCategories}
        onSubmit={handleSubmit}
        submitLabel="Create product"
        loading={loading}
        error={error}
      />
    </AdminShell>
  );
}
