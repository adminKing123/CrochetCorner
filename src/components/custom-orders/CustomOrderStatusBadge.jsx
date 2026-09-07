import { CUSTOM_ORDER_STATUS_LABELS } from "@/lib/custom-orders/defaults";

const statusStyles = {
  pending: "bg-peach/15 text-peach-dark",
  in_review: "bg-lavender/20 text-charcoal",
  accepted: "bg-mint/15 text-mint-dark",
  rejected: "bg-red-100 text-red-700",
  completed: "bg-charcoal/10 text-charcoal",
};

export default function CustomOrderStatusBadge({ status, className = "" }) {
  const label = CUSTOM_ORDER_STATUS_LABELS[status] || status;
  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 font-body text-xs font-semibold ${style} ${className}`}
    >
      {label}
    </span>
  );
}
