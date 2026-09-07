import { SHOP_ORDER_STATUS_LABELS } from "@/lib/shop-orders/defaults";

const statusStyles = {
  pending: "bg-peach/15 text-peach-dark",
  confirmed: "bg-mint/15 text-mint-dark",
  shipped: "bg-lavender/20 text-charcoal",
  delivered: "bg-charcoal/10 text-charcoal",
  cancelled: "bg-red-100 text-red-700",
};

export default function ShopOrderStatusBadge({ status, className = "" }) {
  const label = SHOP_ORDER_STATUS_LABELS[status] || status;
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 font-body text-xs font-semibold ${style} ${className}`}
    >
      {label}
    </span>
  );
}
