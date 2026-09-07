export default function AuthFormHeader({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-3xl font-bold text-charcoal">{title}</h2>
      {subtitle ? (
        <p className="mt-2 font-body text-base text-charcoal/65">{subtitle}</p>
      ) : null}
    </div>
  );
}
