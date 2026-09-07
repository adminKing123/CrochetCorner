import Image from "next/image";
import Link from "next/link";
import { authRoutes, navLinks, siteConfig } from "@/config/site";
import CartIconButton from "@/components/cart/CartIconButton";
import NavbarAuth from "@/components/landing/NavbarAuth";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-peach/15 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href={authRoutes.home} className="flex items-center gap-3">
          <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <span className="font-display text-lg font-bold text-charcoal">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-sm font-medium text-charcoal/70 transition-colors hover:text-mint"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartIconButton />
          <NavbarAuth />
        </div>
      </div>
    </header>
  );
}
