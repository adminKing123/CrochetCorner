"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoAlbumsOutline,
  IoBagOutline,
  IoCreateOutline,
  IoFolderOutline,
  IoImagesOutline,
  IoKeyOutline,
} from "react-icons/io5";
import { adminNavItems, authRoutes, siteConfig } from "@/config/site";

const adminIcons = {
  IoImagesOutline,
  IoBagOutline,
  IoAlbumsOutline,
  IoKeyOutline,
  IoFolderOutline,
  IoCreateOutline,
};

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-peach/15 bg-white md:w-64 md:border-b-0 md:border-r">
      <div className="border-b border-peach/15 px-5 py-5">
        <p className="font-body text-xs font-semibold uppercase tracking-wide text-mint">
          Admin
        </p>
        <h1 className="font-display text-xl font-bold text-charcoal">{siteConfig.name}</h1>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-3 md:flex-col md:overflow-visible md:p-4">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = adminIcons[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-body text-sm font-semibold transition ${
                isActive
                  ? "bg-peach text-white shadow-sm"
                  : "text-charcoal/75 hover:bg-peach/10 hover:text-mint"
              }`}
            >
              {Icon ? <Icon className="h-5 w-5 shrink-0" aria-hidden="true" /> : null}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-peach/15 p-4 md:block">
        <Link
          href={authRoutes.home}
          className="font-body text-sm font-semibold text-mint transition hover:text-mint-dark"
        >
          ← Back to site
        </Link>
      </div>
    </aside>
  );
}
