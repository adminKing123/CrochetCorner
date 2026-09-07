"use client";

import { useCallback } from "react";
import { AuthButton, AuthError, AuthInput } from "@/components/auth/ui";
import SearchableMultiSelect from "@/components/admin/SearchableMultiSelect";
import ProductImagePreview from "@/components/admin/products/ProductImagePreview";
import { categoriesApi, keysApi } from "@/lib/taxonomy/client-api";

export default function ProductForm({
  product,
  selectedKeys,
  selectedCategories,
  onChange,
  onKeysChange,
  onCategoriesChange,
  onSubmit,
  submitLabel,
  loading,
  error,
}) {
  function updateField(field, value) {
    onChange({ ...product, [field]: value });
  }

  const searchKeys = useCallback(
    (search) => keysApi.search({ search }),
    []
  );

  const searchCategories = useCallback(
    (search) => categoriesApi.search({ search }),
    []
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <AuthError message={error} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductImagePreview
          label="Square image preview (1:1)"
          aspectRatio="1/1"
          src={product.imageSquare}
          alt={product.title}
        />
        <ProductImagePreview
          label="Portrait image preview (2:3)"
          aspectRatio="2/3"
          src={product.imagePortrait}
          alt={product.title}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AuthInput
          label="Product title"
          id="title"
          value={product.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Cozy crochet basket"
          required
        />
        <div className="flex items-end">
          <label className="flex items-center gap-3 rounded-2xl border border-peach/20 bg-white px-4 py-3 font-body text-sm font-semibold text-charcoal">
            <input
              type="checkbox"
              checked={product.isBestSeller}
              onChange={(event) => updateField("isBestSeller", event.target.checked)}
              className="h-4 w-4 accent-mint"
            />
            Mark as best seller
          </label>
        </div>
        <AuthInput
          label="Square image URL (1:1)"
          id="imageSquare"
          value={product.imageSquare}
          onChange={(event) => updateField("imageSquare", event.target.value)}
          placeholder="https://..."
          required
        />
        <AuthInput
          label="Portrait image URL (2:3)"
          id="imagePortrait"
          value={product.imagePortrait}
          onChange={(event) => updateField("imagePortrait", event.target.value)}
          placeholder="https://..."
          required
        />
        <AuthInput
          label="Original price"
          id="originalPrice"
          type="number"
          min="0"
          step="0.01"
          value={product.originalPrice}
          onChange={(event) => updateField("originalPrice", event.target.value)}
          required
        />
        <AuthInput
          label="Selling price"
          id="sellingPrice"
          type="number"
          min="0"
          step="0.01"
          value={product.sellingPrice}
          onChange={(event) => updateField("sellingPrice", event.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SearchableMultiSelect
          label="Keys"
          placeholder="Search keys..."
          selectedItems={selectedKeys}
          onChange={onKeysChange}
          onSearch={searchKeys}
          emptyMessage="No keys found. Add keys from the admin sidebar."
        />
        <SearchableMultiSelect
          label="Categories"
          placeholder="Search categories..."
          selectedItems={selectedCategories}
          onChange={onCategoriesChange}
          onSearch={searchCategories}
          emptyMessage="No categories found. Add categories from the admin sidebar."
        />
      </div>

      <AuthButton type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </AuthButton>
    </form>
  );
}
