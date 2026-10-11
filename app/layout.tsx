import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import MouseLightEffect from "@/components/ui/MouseLightEffect";
import MotionProvider from "@/components/providers/MotionProvider";
import LenisProvider from "@/components/providers/LenisProvider";
import CartProvider from "@/components/providers/CartProvider";
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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

export const viewport: Viewport = {
  themeColor: "#141415",
};

export const metadata: Metadata = {
  // Resolves every relative URL in the metadata (share images, canonical
  // links). Set NEXT_PUBLIC_SITE_URL to the real domain when deploying.
  metadataBase: new URL(SITE_URL),
  // Other screens set their own `title`; the template adds the site name.
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_AUTHOR }],
  creator: SITE_AUTHOR,
  formatDetection: { telephone: false },
  // When saved to an iPhone's home screen: open full-screen, with a normal
  // (non-overlapping) black status bar. (The manifest in app/manifest.ts
  // covers Android and desktop.)
  appleWebApp: { capable: true, title: "Beats", statusBarStyle: "black" },
  icons: {
    apple: "/images/favicons/apple-touch-icon.png",
    icon: [
      { url: "/images/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: "/images/fb-og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/images/fb-og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // "overflow-x-clip" (not "-hidden") on both html and body: CSS spec
    // requires that if overflow-x is anything other than `visible` while
    // overflow-y is left unset, the browser silently upgrades that unset
    // `visible` into `auto` — turning body into an accidental VERTICAL
    // clipping box too. That clipped away anything positioned above y=0,
    // which is exactly where Reveal's hidden-state transform (e.g.
    // fade-down's translateY(-100px)) put Header's logo/nav before they'd
    // animated in — so they were being clipped out of existence before
    // IntersectionObserver ever got a chance to detect them as visible.
    // `clip` gives the identical horizontal-bleed protection this was
    // originally added for (Case's image, Hero's desktop headphone) but is
    // specifically exempt from that cross-axis upgrade rule, so overflow-y
    // stays genuinely `visible` — no accidental clipping box, on any
    // screen size. (Needs a reasonably modern browser — Safari 16+/
    // Firefox 102+/Chrome 90+ — unlike `hidden`, which has no such floor;
    // fine for this stack.)
    <html lang="en" className={`max-w-full sm:max-w-none overflow-x-clip sm:overflow-x-visible ${poppins.variable}`}>
      <body className="relative light antialiased bg-[#0F0F10] font-poppins text-white overflow-x-clip">
        {/* MotionProvider: every animation honors "reduce motion".
            CartProvider sits at the root so the bag survives moving between
            screens (it is also what the header, tab bar and mini-bag read
            from). */}
        <MotionProvider>
          <LenisProvider>
            <CartProvider>
              <MouseLightEffect />
              {children}
            </CartProvider>
          </LenisProvider>
        </MotionProvider>
      </body>
    </html>
  );
}