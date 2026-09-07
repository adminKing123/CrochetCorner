import { formatCurrency } from "@/lib/products/format";

export default function ShopOrderItemsList({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <article
          key={`${item.productId}-${item.quantity}`}
          className="flex gap-3 rounded-2xl border border-peach/15 bg-white p-3 shadow-sm"
        >
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-peach/5">
            {item.imageSquare ? (
              <img
                src={item.imageSquare}
                alt={item.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 font-body text-sm font-semibold text-charcoal">
              {item.title}
            </h4>
            <p className="mt-1 font-body text-xs text-charcoal/50">{item.productId}</p>
            <p className="mt-1 font-body text-sm text-charcoal/70">
              Qty: {item.quantity} · {formatCurrency(item.lineTotal)}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
