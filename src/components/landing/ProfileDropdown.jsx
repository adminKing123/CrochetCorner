"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { profileMenuItems } from "@/config/site";
import { auth } from "@/lib/firebase/client";
import UserAvatar from "@/components/landing/UserAvatar";

export default function ProfileDropdown({ user }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user.displayName || "My account";
  const email = user.email || "";

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    setOpen(false);
    await signOut(auth);
  }

  function handleItemClick(item) {
    if (item.action === "logout") {
      handleLogout();
      return;
    }

    setOpen(false);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        className="flex items-center justify-center rounded-full p-0 transition hover:ring-2 hover:ring-peach/40 focus:outline-none focus:ring-2 focus:ring-mint/40"
      >
        <UserAvatar user={user} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-peach/20 bg-white py-2 shadow-lg"
        >
          <div className="border-b border-peach/15 px-4 py-3">
            <p className="truncate font-body text-sm font-semibold text-charcoal">
              {displayName}
            </p>
            {email ? (
              <p className="truncate font-body text-xs text-charcoal/60">{email}</p>
            ) : null}
          </div>

          <ul className="py-1">
            {profileMenuItems.map((item) =>
              item.action === "logout" ? (
                <li key={item.label}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => handleItemClick(item)}
                    className="w-full px-4 py-2.5 text-left font-body text-sm text-red-600 transition hover:bg-red-50"
                  >
                    {item.label}
                  </button>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={() => handleItemClick(item)}
                    className="block px-4 py-2.5 font-body text-sm text-charcoal/80 transition hover:bg-peach/10 hover:text-mint"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
