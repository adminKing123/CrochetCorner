export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export function hasDiscount(originalPrice, sellingPrice) {
  return Number(originalPrice) > Number(sellingPrice);
}

export function getDiscountPercent(originalPrice, sellingPrice) {
  const original = Number(originalPrice);
  const selling = Number(sellingPrice);

  if (!original || selling >= original) return 0;

  return Math.round(((original - selling) / original) * 100);
}
