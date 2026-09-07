export default function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <section id={id} className={`px-6 py-14 md:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || description) && (
          <header className="mb-10 max-w-2xl">
            {eyebrow ? (
              <p className="mb-2 font-body text-sm font-bold uppercase tracking-widest text-peach">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="font-display text-3xl font-bold text-charcoal md:text-4xl">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-3 font-body text-base leading-relaxed text-charcoal/70 md:text-lg">
                {description}
              </p>
            ) : null}
          </header>
        )}

        {children}
      </div>
    </section>
  );
}
