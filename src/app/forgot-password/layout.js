import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Forgot password", {
  description: "Reset your Crochet Corner password.",
  path: "/forgot-password",
});

export default function ForgotPasswordLayout({ children }) {
  return children;
}
