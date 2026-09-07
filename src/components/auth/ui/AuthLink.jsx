import Link from "next/link";

export default function AuthLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`font-body font-semibold text-mint transition-colors hover:text-mint-dark ${className}`}
    >
      {children}
    </Link>
  );
}
