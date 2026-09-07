import "./globals.css";

export const metadata = {
  title: "Crochet Corner",
  description: "Sign in to Crochet Corner",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
