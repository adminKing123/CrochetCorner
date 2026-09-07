export default function SectionHeader({
  eyebrow,
  title,
  description,
  className = "",
  align = "left",
}) {
  const alignClass =
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl text-left";

  return (
    <header className={`${alignClass} ${className}`}>
      {eyebrow ? (
        <p className="mb-2 font-body text-sm font-bold uppercase tracking-widest text-peach">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h2 className="font-display text-3xl font-bold text-charcoal md:text-5xl lg:text-6xl">
          {title}
        </h2>
      ) : null}
      {description ? (
        <p className="mt-4 font-body text-base leading-relaxed text-charcoal/70 md:text-lg">
          {description}
        </p>
      ) : null}
    </header>
  );
}
