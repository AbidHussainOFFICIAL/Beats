import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import MouseLightEffect from "@/components/ui/MouseLightEffect";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  // "block" instead of "swap": the hero's "On ear" heading uses tight,
  // hand-tuned negative-margin kerning specific to Poppins' letter widths.
  // With "swap", the fallback system font briefly renders first (visible
  // especially on a hard refresh, before the font is cached) — and since
  // that fallback's letters are a different width, the same tight margins
  // make it look cluttered/overlapping until the swap to Poppins corrects
  // it. "block" hides text briefly instead of showing it in the wrong font,
  // avoiding that mismatched-kerning flash entirely.
  display: "block",
});

export const metadata: Metadata = {
  title: "Beats Landing Page",
  description: "Beats headphones landing page",
  applicationName: "Beats Landing Page",
  themeColor: "#141415",
  icons: {
    apple: "/images/favicons/apple-touch-icon.png",
    icon: [
      { url: "/images/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Beats Landing Page",
    description: "Beats Landing Page",
    type: "article",
    siteName: "Beats Landing Page",
    url: "https://jakebogan.dev",
    images: ["/images/fb-og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // "scroll-smooth" (Tailwind's `scroll-behavior: smooth`) removed —
    // Lenis now owns scroll easing exclusively. Leaving native smooth-
    // scroll active alongside Lenis makes the two fight over the same
    // scroll position on every anchor-link jump (a native instant-ish CSS
    // animation competing with Lenis's own rAF-driven one), which reads as
    // janky/stuttery instead of smooth. See globals.css for the matching
    // removal of the same rule there, and LenisProvider.tsx for how anchor
    // links now get their smoothing from Lenis directly instead.
    <html lang="en" className={`max-w-full sm:max-w-none overflow-x-hidden sm:overflow-x-visible ${poppins.variable}`}>
      <body className="relative light antialiase bg-[#0F0F10] font-poppins text-white overflow-x-hidden">
        <LenisProvider>
          <MouseLightEffect />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}