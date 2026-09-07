export default function Pagination({ pagination, onPageChange, className = "" }) {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const { page, totalPages, total } = pagination;

  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <p className="font-body text-sm text-charcoal/60">
        Page {page} of {totalPages} · {total} total
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-xl border border-peach/25 px-4 py-2 font-body text-sm font-semibold text-charcoal transition hover:bg-peach/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-xl border border-peach/25 px-4 py-2 font-body text-sm font-semibold text-charcoal transition hover:bg-peach/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
