import { Fredoka, Nunito } from "next/font/google";

export const displayFont = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const bodyFont = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const fontVariables = `${displayFont.variable} ${bodyFont.variable}`;
