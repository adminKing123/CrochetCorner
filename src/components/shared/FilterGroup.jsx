export default function FilterGroup({ title, children, className = "" }) {
  return (
    <div className={className}>
      <h3 className="mb-3 font-body text-sm font-bold uppercase tracking-wide text-charcoal/60">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
