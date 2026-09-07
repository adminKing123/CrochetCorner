export default function CollectionDescription({ description, className = "" }) {
  if (!description) {
    return null;
  }

  return (
    <p
      className={`line-clamp-6 font-body text-sm leading-relaxed text-charcoal/70 ${className}`}
    >
      {description}
    </p>
  );
}
