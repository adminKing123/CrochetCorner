import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Sign in", {
  description: "Sign in to Crochet Corner with Google or email.",
  path: "/login",
});

export default function LoginLayout({ children }) {
  return children;
}
