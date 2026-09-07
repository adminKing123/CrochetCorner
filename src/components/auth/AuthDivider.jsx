export default function AuthDivider({ label = "or continue with email" }) {
  return (
    <div className="relative py-1">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-peach/25" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-cream px-4 font-body text-xs font-medium uppercase tracking-wider text-charcoal/45">
          {label}
        </span>
      </div>
    </div>
  );
}
