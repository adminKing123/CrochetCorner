export default function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full px-4 py-2 font-body text-sm font-semibold transition ${
        active
          ? "bg-mint text-white shadow-sm"
          : "border border-peach/25 bg-white text-charcoal hover:border-peach/40 hover:bg-peach/5"
      }`}
    >
      {label}
    </button>
  );
}
