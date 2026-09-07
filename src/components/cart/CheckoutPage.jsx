"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useCart } from "@/components/cart/CartProvider";
import { AuthButton, AuthError, AuthInput, AuthSuccess } from "@/components/auth/ui";
import { authRoutes } from "@/config/site";
import { useAuthUser } from "@/hooks/useAuthUser";
import { createShopOrder } from "@/lib/shop-orders/client-api";
import { createEmptyCheckoutInput } from "@/lib/shop-orders/validation";
import { formatCurrency } from "@/lib/products/format";
import { fetchPublicProductsByIds } from "@/lib/products/client-api";

function AuthTextarea({ label, id, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <span className="mb-2 block font-body text-sm font-semibold text-charcoal">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-2xl border-2 border-peach/20 bg-white px-4 py-3 font-body text-charcoal outline-none transition placeholder:text-charcoal/35 focus:border-mint focus:ring-4 focus:ring-mint/15"
      />
    </label>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, email } = useAuthUser();
  const { cart, ready, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(createEmptyCheckoutInput());
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const productIds = useMemo(
    () => cart.items.map((item) => item.productId).join(","),
    [cart.items]
  );

  useEffect(() => {
    if (!ready) return;

    if (!cart.items.length) {
      router.replace(authRoutes.cart);
      return;
    }

    setLoadingProducts(true);
    fetchPublicProductsByIds(cart.items.map((item) => item.productId))
      .then(setProducts)
      .finally(() => setLoadingProducts(false));
  }, [cart.items, productIds, ready, router]);

  const lines = cart.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;

      return {
        productId: item.productId,
        quantity: item.quantity,
        title: product.title,
        unitPrice: product.sellingPrice,
        lineTotal: product.sellingPrice * item.quantity,
        imageSquare: product.imageSquare,
      };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createShopOrder(
        email,
        {
          items: cart.items,
          mobile: form.mobile,
          deliveryNotes: form.deliveryNotes,
        },
        user?.displayName || ""
      );

      clearCart();
      setSuccess("Order placed successfully. We will contact you to confirm payment and delivery.");
      window.setTimeout(() => router.push(authRoutes.myOrders), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthGuard redirectTo={authRoutes.checkout}>
      <div className="landing-hero min-h-screen px-6 py-10 md:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Link
              href={authRoutes.cart}
              className="mb-4 inline-flex font-body text-sm font-semibold text-mint transition hover:text-mint-dark"
            >
              ← Back to cart
            </Link>
            <h1 className="font-display text-3xl font-bold text-charcoal md:text-4xl">Checkout</h1>
            <p className="mt-2 font-body text-sm text-charcoal/70">
              Payment will be arranged by contacting you after the order is placed.
            </p>
          </div>

          {loadingProducts ? (
            <p className="font-body text-charcoal/70">Loading checkout...</p>
          ) : (
            <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5 rounded-3xl border border-peach/15 bg-white p-6 shadow-sm md:p-8">
                <p className="font-body text-sm text-charcoal/60">
                  Placing order as <span className="font-semibold text-charcoal">{email}</span>
                </p>

                <AuthInput
                  label="Mobile number (optional)"
                  id="checkout-mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(event) => updateField("mobile", event.target.value)}
                  placeholder="Your contact number"
                  autoComplete="tel"
                />

                <AuthTextarea
                  label="Delivery address / notes (optional)"
                  id="checkout-notes"
                  value={form.deliveryNotes}
                  onChange={(event) => updateField("deliveryNotes", event.target.value)}
                  placeholder="Share your address or any delivery instructions..."
                />

                {error ? <AuthError message={error} /> : null}
                {success ? <AuthSuccess message={success} /> : null}

                <AuthButton type="submit" disabled={submitting}>
                  {submitting ? "Placing order..." : "Place order"}
                </AuthButton>
              </div>

              <aside className="h-fit rounded-3xl border border-peach/15 bg-white p-6 shadow-sm">
                <h2 className="font-display text-xl font-bold text-charcoal">Order summary</h2>
                <ul className="mt-4 space-y-3">
                  {lines.map((line) => (
                    <li key={line.productId} className="flex justify-between gap-3 font-body text-sm">
                      <span className="text-charcoal/80">
                        {line.title} x{line.quantity}
                      </span>
                      <span className="font-semibold text-charcoal">
                        {formatCurrency(line.lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between border-t border-peach/10 pt-4 font-body text-sm">
                  <span className="text-charcoal/70">Subtotal</span>
                  <span className="font-bold text-charcoal">{formatCurrency(subtotal)}</span>
                </div>
                <p className="mt-3 font-body text-xs text-charcoal/55">
                  Delivery charges will be discussed later when we contact you.
                </p>
              </aside>
            </form>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
