"use client";

import AuthBrandPanel from "@/components/auth/AuthBrandPanel";

export default function AuthSplitLayout({ children, footer }) {
  return (
    <div className="auth-bg min-h-screen lg:grid lg:grid-cols-2">
      <AuthBrandPanel />

      <main className="flex flex-col items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          {children}
          {footer ? (
            <div className="mt-8 text-center font-body text-sm text-charcoal/70">
              {footer}
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
