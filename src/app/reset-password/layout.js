import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Reset password", {
  description: "Set a new password for your Crochet Corner account.",
  path: "/reset-password",
});

export default function ResetPasswordLayout({ children }) {
  return children;
}
