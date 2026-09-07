export default function CollectionDescription({ description, className = "", lines = 6 }) {
  if (!description) {
    return null;
  }

  const lineClampClass = lines === 3 ? "line-clamp-3" : "line-clamp-6";

  return (
    <p
      className={`${lineClampClass} font-body text-sm leading-relaxed text-charcoal/70 ${className}`}
    >
      {description}
    </p>
  );
}
