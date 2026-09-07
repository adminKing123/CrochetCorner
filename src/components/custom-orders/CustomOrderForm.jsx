"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import SearchableMultiSelect from "@/components/shared/SearchableMultiSelect";
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "@/components/auth/ui";
import { authRoutes } from "@/config/site";
import { useAuthUser } from "@/hooks/useAuthUser";
import { createCustomOrder } from "@/lib/custom-orders/client-api";
import { createEmptyCustomOrderInput } from "@/lib/custom-orders/validation";
import { searchProductsForPickerPublic } from "@/lib/products/client-api";

function AuthTextarea({ label, id, value, onChange, placeholder, required, rows = 5 }) {
  return (
    <label className="block">
      <span className="mb-2 block font-body text-sm font-semibold text-charcoal">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full resize-y rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
      />
    </label>
  );
}

export default function CustomOrderForm() {
  const { user, email } = useAuthUser();
  const [form, setForm] = useState(createEmptyCustomOrderInput());
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const searchProducts = useCallback((search) => searchProductsForPickerPublic(search), []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleProductsChange(items) {
    setSelectedProducts(items);
    setForm((current) => ({
      ...current,
      productIds: items.map((item) => item.id),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createCustomOrder(email, form, user?.displayName || "");
      setSuccess("Your custom order request has been submitted. We will contact you soon.");
      setForm(createEmptyCustomOrderInput());
      setSelectedProducts([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-peach/15 bg-white p-6 shadow-sm md:p-8">
      <div className="mb-6">
        <p className="font-body text-sm text-charcoal/60">
          Signed in as <span className="font-semibold text-charcoal">{email}</span>
        </p>
        <Link
          href={authRoutes.myCustomOrders}
          className="mt-2 inline-flex font-body text-sm font-semibold text-mint transition hover:text-mint-dark"
        >
          View my requests →
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthTextarea
          label="What would you like us to make?"
          id="custom-order-details"
          value={form.details}
          onChange={(event) => updateField("details", event.target.value)}
          placeholder="Describe colors, size, style, deadline, or any inspiration you have in mind..."
          required
        />

        <SearchableMultiSelect
          label="Reference products (optional)"
          placeholder="Search by product title or ID..."
          selectedItems={selectedProducts}
          onChange={handleProductsChange}
          onSearch={searchProducts}
          getOptionDescription={(item) => `ID: ${item.id}`}
          emptyMessage="No products found."
        />

        <AuthInput
          label="Mobile number (optional)"
          id="custom-order-mobile"
          type="tel"
          value={form.mobile}
          onChange={(event) => updateField("mobile", event.target.value)}
          placeholder="Your contact number"
          autoComplete="tel"
        />

        {error ? <AuthError message={error} /> : null}
        {success ? <AuthSuccess message={success} /> : null}

        <AuthButton type="submit" disabled={submitting}>
          {submitting ? "Sending request..." : "Send request"}
        </AuthButton>
      </form>
    </div>
  );
}
