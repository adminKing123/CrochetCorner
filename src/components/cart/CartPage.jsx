"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoTrashOutline } from "react-icons/io5";
import { useCart } from "@/components/cart/CartProvider";
import ProductImage from "@/components/products/ProductImage";
import { AuthButton } from "@/components/auth/ui";
import { authRoutes } from "@/config/site";
import { buildAuthRedirectUrl } from "@/lib/auth/redirect";
import { useAuthUser } from "@/hooks/useAuthUser";
import { formatCurrency } from "@/lib/products/format";
import { fetchPublicProductsByIds } from "@/lib/products/client-api";
import { CART_MAX_QUANTITY } from "@/lib/shop-orders/defaults";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthUser();
  const { cart, ready, removeItem, setQuantity } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const productIds = useMemo(
    () => cart.items.map((item) => item.productId).join(","),
    [cart.items]
  );

  useEffect(() => {
    if (!ready) return;

    if (!cart.items.length) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchPublicProductsByIds(cart.items.map((item) => item.productId))
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [cart.items, productIds, ready]);

  const lines = cart.items
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      if (!product) return null;

      return {
        ...item,
        product,
        lineTotal: product.sellingPrice * item.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);

  function handleCheckout() {
    if (!user) {
      router.push(buildAuthRedirectUrl(authRoutes.login, authRoutes.checkout));
      return;
    }

    router.push(authRoutes.checkout);
  }

  if (!ready || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-body text-charcoal/70">Loading cart...</p>
      </div>
    );
  }

  if (!cart.items.length) {
    return (
      <div className="landing-hero min-h-[60vh] px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-peach/20 bg-white px-6 py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-charcoal">Your cart is empty</h1>
          <p className="mt-3 font-body text-charcoal/70">
            Browse the shop and add handmade pieces you love.
          </p>
          <Link
            href={authRoutes.shop}
            className="mt-6 inline-flex rounded-full bg-mint px-6 py-3 font-body text-sm font-bold text-white transition hover:bg-mint-dark"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-hero min-h-screen px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 font-display text-3xl font-bold text-charcoal md:text-4xl">Your cart</h1>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {lines.map((line) => (
              <article
                key={line.productId}
                className="flex gap-4 rounded-3xl border border-peach/15 bg-white p-4 shadow-sm md:p-5"
              >
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl">
                  <ProductImage
                    src={line.product.imageSquare || line.product.imagePortrait}
                    alt={line.product.title}
                    aspectRatio="1/1"
                    className="h-full w-full rounded-2xl"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h2 className="font-display text-lg font-bold text-charcoal">{line.product.title}</h2>
                  <p className="mt-1 font-body text-xs text-charcoal/50">{line.product.id}</p>
                  <p className="mt-2 font-body text-sm font-semibold text-mint">
                    {formatCurrency(line.product.sellingPrice)}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                    <label className="flex items-center gap-2 font-body text-sm text-charcoal/70">
                      Qty
                      <select
                        value={line.quantity}
                        onChange={(event) =>
                          setQuantity(line.productId, Number(event.target.value))
                        }
                        className="rounded-xl border border-peach/20 bg-white px-3 py-1.5 font-body text-sm outline-none focus:border-mint"
                      >
                        {Array.from({ length: CART_MAX_QUANTITY }, (_, index) => index + 1).map(
                          (value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeItem(line.productId)}
                      className="inline-flex items-center gap-1 font-body text-sm font-semibold text-red-600 transition hover:text-red-700"
                    >
                      <IoTrashOutline className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>

                <p className="font-body text-sm font-bold text-charcoal">
                  {formatCurrency(line.lineTotal)}
                </p>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-peach/15 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-charcoal">Order summary</h2>
            <div className="mt-4 space-y-2 font-body text-sm text-charcoal/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-xs text-charcoal/55">
                Delivery charges will be discussed when we contact you.
              </p>
            </div>

            <div className="mt-6">
              <AuthButton type="button" onClick={handleCheckout}>
                {user ? "Proceed to checkout" : "Login to checkout"}
              </AuthButton>
            </div>

            {!user ? (
              <p className="mt-3 text-center font-body text-xs text-charcoal/60">
                You can shop as a guest. Sign in only when you are ready to place the order.
              </p>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
