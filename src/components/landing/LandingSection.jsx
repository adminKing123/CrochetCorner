import Link from "next/link";

const eyebrowToneClasses = {
  peach: "text-peach",
  mint: "text-mint",
  lavender: "text-lavender",
};

export default function LandingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className = "",
  align = "left",
  eyebrowTone = "peach",
  headerAction,
}) {
  const isCentered = align === "center";
  const eyebrowClass = eyebrowToneClasses[eyebrowTone] || eyebrowToneClasses.peach;

  return (
    <section id={id} className={`px-6 py-14 md:py-20 ${className}`}>
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || description || headerAction) && (
          <header
            className={`mb-10 ${isCentered ? "mx-auto max-w-3xl text-center" : "max-w-7xl"}`}
          >
            <div
              className={
                !isCentered && headerAction
                  ? "flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                  : undefined
              }
            >
              <div className={isCentered ? undefined : "max-w-2xl"}>
                {eyebrow ? (
                  <p
                    className={`mb-2 font-body text-sm font-bold uppercase tracking-widest ${eyebrowClass}`}
                  >
                    {eyebrow}
                  </p>
                ) : null}
                {title ? (
                  <h2 className="font-display text-3xl font-bold text-charcoal md:text-4xl">
                    {title}
                  </h2>
                ) : null}
                {description ? (
                  <p
                    className={`mt-3 font-body text-base leading-relaxed text-charcoal/70 md:text-lg ${
                      isCentered ? "mx-auto max-w-2xl" : ""
                    }`}
                  >
                    {description}
                  </p>
                ) : null}
              </div>

              {headerAction ? (
                <div className={isCentered ? "mt-6 flex justify-center" : "shrink-0"}>
                  {headerAction}
                </div>
              ) : null}
            </div>
          </header>
        )}

        {children}
      </div>
    </section>
  );
}

export function LandingSectionLink({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-body text-sm font-bold text-mint transition hover:text-mint-dark md:text-base"
    >
      {children}
    </Link>
  );
}

export function LandingSectionFooterLink({
  href,
  children,
  align = "center",
  className = "",
}) {
  const alignClass = align === "left" ? "justify-start" : "justify-center";

  return (
    <div className={`mt-8 flex md:mt-10 ${alignClass} ${className}`}>
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border-2 border-mint/25 bg-white px-6 py-3 font-body text-sm font-semibold text-mint shadow-sm transition hover:border-mint hover:bg-mint hover:text-white md:px-8 md:py-3.5 md:text-base"
      >
        {children}
      </Link>
    </div>
  );
}
