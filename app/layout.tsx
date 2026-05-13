import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/* ── Fonts ────────────────────────────────────────────────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

/* ── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "Legacy Trivia – Master the Art of Connection",
  description:
    "A trivia experience that challenges your mind, sharpens your intuition, and rewards your knowledge. This is not just a game. It's a seasonal challenge.",
  keywords: ["trivia", "game", "dating", "challenge", "seasonal"],
};

/* ── Root Layout ──────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="bg-[#040C1A] text-[#EDEEFF] min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

