const VARIANTS = {
  primary:
    "bg-peach text-white shadow-md hover:-translate-y-0.5 hover:bg-peach-dark hover:shadow-lg active:translate-y-0",
  google:
    "border-2 border-charcoal/10 bg-white text-charcoal shadow-sm hover:border-peach/40 hover:bg-peach/5 hover:shadow-md",
};

export default function AuthButton({
  children,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center rounded-2xl px-5 py-3.5 font-body text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]}`}
    >
      {children}
    </button>
  );
}
