import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Admin Panel", {
  description: "Crochet Corner admin panel.",
  path: "/admin",
});

export default function AdminLayout({ children }) {
  return children;
}
