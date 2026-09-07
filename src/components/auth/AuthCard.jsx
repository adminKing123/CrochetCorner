export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="auth-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border-2 border-peach/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-charcoal">{title}</h1>
          {subtitle ? (
            <p className="mt-2 font-body text-sm text-charcoal/70">{subtitle}</p>
          ) : null}
        </div>
        {children}
        {footer ? (
          <div className="mt-6 text-center font-body text-sm text-charcoal/70">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
