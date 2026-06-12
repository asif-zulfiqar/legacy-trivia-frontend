import type { Metadata, Viewport } from "next";
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pairpel.com";
const SITE_NAME = "Pairpel";
const SITE_TITLE = "Pairpel — Master the Art of Connection";
const SITE_DESCRIPTION =
  "Pairpel is a trivia experience that challenges your mind, sharpens your intuition, and rewards your knowledge. Pair up, play smart, build your legacy.";

/* ── Metadata ─────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Pairpel",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Pairpel",
    "pairpel",
    "pairpel trivia",
    "pairpel game",
    "trivia game",
    "couples trivia",
    "dating trivia",
    "relationship game",
    "online trivia",
    "win money trivia",
    "trivia challenges",
    "legacy trivia",
  ],
  authors: [{ name: "Pairpel Games Ltd." }],
  creator: "Pairpel Games Ltd.",
  publisher: "Pairpel Games Ltd.",
  category: "games",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: `${SITE_URL}/images/logo.png`,
        width: 1200,
        height: 630,
        alt: "Pairpel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/images/logo.png`],
    creator: "@pairpel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo.png", type: "image/png" },
    ],
    apple: "/images/logo.png",
  },
  manifest: "/site.webmanifest",
  verification: {
    // Add when verified at https://search.google.com/search-console
    // google: "your-google-site-verification-token",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0628",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ── JSON-LD structured data (Organization + WebSite) ─────────────────── */
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "Pairpel Games Ltd.",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  sameAs: [
    "https://www.instagram.com/pairpeltrivia",
    "https://discord.gg/VAT567AMh",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
