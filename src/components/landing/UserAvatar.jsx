"use client";

import { useState } from "react";
import { getUserInitial } from "@/lib/auth/user";

const sizes = {
  sm: { box: "h-8 w-8", text: "text-xs" },
  md: { box: "h-9 w-9", text: "text-sm" },
  lg: { box: "h-11 w-11", text: "text-base" },
};

export default function UserAvatar({ user, size = "md" }) {
  const [imageError, setImageError] = useState(false);
  const { box, text } = sizes[size] || sizes.md;
  const label = user.displayName || user.email || "Profile";
  const showImage = user.photoURL && !imageError;

  return (
    <div
      title={label}
      aria-label={label}
      className={`flex shrink-0 ${box} items-center justify-center overflow-hidden rounded-full bg-mint font-body font-bold leading-none text-white ring-2 ring-peach/30 ${!showImage ? text : ""}`}
    >
      {showImage ? (
        <img
          src={user.photoURL}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="block h-full w-full object-cover object-center"
        />
      ) : (
        <span className="select-none">{getUserInitial(user)}</span>
      )}
    </div>
  );
}
