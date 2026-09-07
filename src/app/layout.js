import { createMetadata } from "@/lib/metadata";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata = createMetadata();

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
