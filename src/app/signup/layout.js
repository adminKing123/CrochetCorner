import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata("Sign up", {
  description: "Create your Crochet Corner account.",
  path: "/signup",
});

export default function SignupLayout({ children }) {
  return children;
}
