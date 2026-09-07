"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/landing/Navbar";

export default function AdminShell({ title, description, children }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-cream">
        <Navbar />

        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col md:flex-row">
          <AdminSidebar />

          <main className="flex-1 px-6 py-8">
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold text-charcoal">{title}</h2>
              {description ? (
                <p className="mt-2 font-body text-charcoal/70">{description}</p>
              ) : null}
            </div>

            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
