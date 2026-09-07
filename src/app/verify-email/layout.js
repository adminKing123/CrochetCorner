import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Verify email", {
  description: "Verify your Crochet Corner email address.",
  path: "/verify-email",
});

export default function VerifyEmailLayout({ children }) {
  return children;
}
