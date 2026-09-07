"use client";

import Image from "next/image";
import Link from "next/link";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="auth-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-peach/30 bg-cream/90 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/CrochetCornerLogo.png"
            alt="Crochet Corner"
            width={120}
            height={120}
            className="mb-4 rounded-full"
            priority
          />
          <h1 className="text-2xl font-semibold text-charcoal">{title}</h1>
          {subtitle ? (
            <p className="mt-2 text-sm text-charcoal/70">{subtitle}</p>
          ) : null}
        </div>

        {children}

        {footer ? (
          <div className="mt-6 text-center text-sm text-charcoal/70">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

export function AuthLink({ href, children }) {
  return (
    <Link href={href} className="font-medium text-mint hover:text-mint-dark transition-colors">
      {children}
    </Link>
  );
}

export function AuthButton({
  children,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
}) {
  const base =
    "w-full rounded-full px-5 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60";
  const styles =
    variant === "google"
      ? "border border-charcoal/15 bg-white text-charcoal hover:bg-peach/10"
      : "bg-peach text-white hover:bg-peach-dark shadow-md hover:shadow-lg";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles}`}
    >
      {children}
    </button>
  );
}

export function AuthInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-charcoal">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-peach/30 bg-white px-4 py-3 text-charcoal outline-none transition focus:border-mint focus:ring-2 focus:ring-mint/20"
      />
    </label>
  );
}

export function AuthError({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

export function AuthSuccess({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint-dark">
      {message}
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg className="mr-2 inline h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
