"use client";

import { useCallback } from "react";
import { AuthButton, AuthError, AuthInput } from "@/components/auth/ui";
import ProductImagePreview from "@/components/admin/products/ProductImagePreview";
import CollectionItemsPreview from "@/components/admin/collections/CollectionItemsPreview";
import SearchableMultiSelect from "@/components/shared/SearchableMultiSelect";
import { searchProductsForPicker } from "@/lib/products/client-api";

export default function CollectionForm({
  collection,
  selectedProducts,
  onChange,
  onProductsChange,
  onSubmit,
  submitLabel,
  loading,
  error,
  adminEmail,
}) {
  function updateField(field, value) {
    onChange({ ...collection, [field]: value });
  }

  const searchProducts = useCallback(
    (search) => searchProductsForPicker(adminEmail, search),
    [adminEmail]
  );

  function handleProductsChange(items) {
    const nextMap = new Map(selectedProducts.map((product) => [product.id, product]));

    onProductsChange(
      items.map((item) => {
        const existing = nextMap.get(item.id);
        return existing ? { ...existing, ...item, name: item.name || item.title } : item;
      })
    );
  }

  function handleRemoveProduct(productId) {
    onProductsChange(selectedProducts.filter((product) => product.id !== productId));
  }

  const pickerItems = selectedProducts.map((product) => ({
    ...product,
    name: product.title || product.name,
  }));

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <AuthError message={error} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductImagePreview
          label="Square image preview (1:1)"
          aspectRatio="1/1"
          src={collection.imageSquare}
          alt={collection.title}
        />
        <ProductImagePreview
          label="Portrait image preview (2:3)"
          aspectRatio="2/3"
          src={collection.imagePortrait}
          alt={collection.title}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AuthInput
          label="Collection title"
          id="title"
          value={collection.title}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Summer cozy picks"
          required
        />
        <div className="flex items-end">
          <label className="flex items-center gap-3 rounded-2xl border border-peach/20 bg-white px-4 py-3 font-body text-sm font-semibold text-charcoal">
            <input
              type="checkbox"
              checked={collection.isTrending}
              onChange={(event) => updateField("isTrending", event.target.checked)}
              className="h-4 w-4 accent-mint"
            />
            Mark as trending
          </label>
        </div>
        <AuthInput
          label="Square image URL (1:1)"
          id="imageSquare"
          value={collection.imageSquare}
          onChange={(event) => updateField("imageSquare", event.target.value)}
          placeholder="https://..."
          required
        />
        <AuthInput
          label="Portrait image URL (2:3)"
          id="imagePortrait"
          value={collection.imagePortrait}
          onChange={(event) => updateField("imagePortrait", event.target.value)}
          placeholder="https://..."
          required
        />
      </div>

      <label className="block">
        <span className="mb-2 block font-body text-sm font-semibold text-charcoal">
          Description
        </span>
        <textarea
          id="description"
          value={collection.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe this collection..."
          rows={4}
          className="w-full rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
        />
      </label>

      <SearchableMultiSelect
        label="Products"
        placeholder="Search by product title or ID..."
        selectedItems={pickerItems}
        onChange={handleProductsChange}
        onSearch={searchProducts}
        getOptionDescription={(item) => `ID: ${item.id}`}
        emptyMessage="No products found."
      />

      <div>
        <h3 className="mb-3 font-body text-sm font-bold uppercase tracking-wide text-charcoal/60">
          Collection preview ({selectedProducts.length})
        </h3>
        <CollectionItemsPreview products={selectedProducts} onRemove={handleRemoveProduct} />
      </div>

      <AuthButton type="submit" disabled={loading}>
        {loading ? "Saving..." : submitLabel}
      </AuthButton>
    </form>
  );
}
