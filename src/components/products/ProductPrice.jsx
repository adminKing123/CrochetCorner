import { formatCurrency, getDiscountPercent, hasDiscount } from "@/lib/products/format";

export default function ProductPrice({
  originalPrice,
  sellingPrice,
  size = "md",
  className = "",
}) {
  const discounted = hasDiscount(originalPrice, sellingPrice);
  const discountPercent = getDiscountPercent(originalPrice, sellingPrice);

  const sellingClass =
    size === "lg"
      ? "font-display text-xl font-bold text-mint"
      : "font-display text-lg font-bold text-mint";

  const originalClass =
    size === "lg"
      ? "font-body text-sm text-charcoal/45 line-through"
      : "font-body text-xs text-charcoal/45 line-through";

  return (
    <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
      <span className={sellingClass}>{formatCurrency(sellingPrice)}</span>
      {discounted ? (
        <>
          <span className={originalClass}>{formatCurrency(originalPrice)}</span>
          {discountPercent > 0 ? (
            <span className="rounded-full bg-peach/15 px-2 py-0.5 font-body text-xs font-semibold text-peach-dark">
              {discountPercent}% off
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
